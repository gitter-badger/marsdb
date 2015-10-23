import model from '../lib/Document';
import CollectionIndex from '../lib/CollectionIndex';
import async from 'async';
import chai, {except, assert} from 'chai';
chai.use(require('chai-as-promised'));
chai.should();


describe('CollectionIndexe', function () {

  describe('Insertion', function () {

    it('Can insert pointers to documents in the index correctly when they have the field', function () {
      var idx = new CollectionIndex({ fieldName: '_id' })
        , doc1 = { a: 5, _id: 'hello' }
        , doc2 = { a: 8, _id: 'world' }
        , doc3 = { a: 2, _id: 'bloup' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      // The underlying BST now has 3 nodes which contain the docs where it's expected
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('hello'), ['hello']);
      assert.deepEqual(idx.tree.search('world'), ['world']);
      assert.deepEqual(idx.tree.search('bloup'), ['bloup']);

      // The nodes contain _id of the actual documents
      idx.tree.search('world')[0].should.equal(doc2._id);
    });

    it('Inserting twice for the same fieldName in a unique index will result in an error thrown', function () {
      var idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        , doc1 = { a: 5, tf: 'hello' }
        ;

      idx.insert(doc1);
      idx.tree.getNumberOfKeys().should.equal(1);
      (function () { idx.insert(doc1); }).should.throw();
    });

    it('Inserting twice for a fieldName the docs dont have with a unique index results in an error thrown', function () {
      var idx = new CollectionIndex({ fieldName: 'nope', unique: true })
        , doc1 = { a: 5, tf: 'hello' }
        , doc2 = { a: 5, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.tree.getNumberOfKeys().should.equal(1);
      (function () { idx.insert(doc2); }).should.throw();
    });

    it('Inserting twice for a fieldName the docs dont have with a unique and sparse index will not throw, since the docs will be non indexed', function () {
      var idx = new CollectionIndex({ fieldName: 'nope', unique: true, sparse: true })
        , doc1 = { a: 5, tf: 'hello' }
        , doc2 = { a: 5, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.tree.getNumberOfKeys().should.equal(0);   // Docs are not indexed
    });

    it('Works with dot notation', function () {
      var idx = new CollectionIndex({ fieldName: 'tf.nested' })
        , doc1 = { _id: 5, tf: { nested: 'hello' } }
        , doc2 = { _id: 8, tf: { nested: 'world', additional: true } }
        , doc3 = { _id: 2, tf: { nested: 'bloup', age: 42 } }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      // The underlying BST now has 3 nodes which contain the docs where it's expected
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('hello'), [doc1._id]);
      assert.deepEqual(idx.tree.search('world'), [doc2._id]);
      assert.deepEqual(idx.tree.search('bloup'), [doc3._id]);
    });

	describe('Array fields', function () {

	  it('Inserts one entry per array element in the index', function () {
      var obj = { tf: ['aa', 'bb'], really: 'yeah', _id: 1 }
        , obj2 = { tf: 'normal', yes: 'indeed', _id: 2 }
        , idx = new CollectionIndex({ fieldName: 'tf' })
        ;

      idx.insert(obj);
      idx.getAll().length.should.equal(2);
      idx.getAll()[0].should.equal(obj._id);
      idx.getAll()[1].should.equal(obj._id);

      idx.insert(obj2);
      idx.getAll().length.should.equal(3);
	  });

	  it('Inserts one entry per array element in the index, type-checked', function () {
      var obj = { tf: ['42', 42, new Date(42), 42], really: 'yeah', _id: 1 }
        , idx = new CollectionIndex({ fieldName: 'tf' })
        ;

      idx.insert(obj);
      idx.getAll().length.should.equal(3);
      idx.getAll()[0].should.equal(obj._id);
      idx.getAll()[1].should.equal(obj._id);
      idx.getAll()[2].should.equal(obj._id);
	  });

	  it('Inserts one entry per unique array element in the index, the unique constraint only holds across documents', function () {
      var obj = { tf: ['aa', 'aa'], really: 'yeah', _id: 1 }
        , obj2 = { tf: ['cc', 'yy', 'cc'], yes: 'indeed', _id: 2 }
        , idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        ;

      idx.insert(obj);
      idx.getAll().length.should.equal(1);
      idx.getAll()[0].should.equal(obj._id);

      idx.insert(obj2);
      idx.getAll().length.should.equal(3);
	  });

	  it('The unique constraint holds across documents', function () {
      var obj = { tf: ['aa', 'aa'], really: 'yeah', _id: 1 }
        , obj2 = { tf: ['cc', 'aa', 'cc'], yes: 'indeed', _id: 2 }
        , idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        ;

      idx.insert(obj);
      idx.getAll().length.should.equal(1);
      idx.getAll()[0].should.equal(obj._id);

      (function () { idx.insert(obj2); }).should.throw();
	  });

    it('When removing a document, remove it from the index at all unique array elements', function () {
      var obj = { tf: ['aa', 'aa'], really: 'yeah', _id: 1 }
        , obj2 = { tf: ['cc', 'aa', 'cc'], yes: 'indeed', _id: 2 }
        , idx = new CollectionIndex({ fieldName: 'tf' })
        ;

      idx.insert(obj);
      idx.insert(obj2);
      idx.getMatching('aa').length.should.equal(2);
      idx.getMatching('aa').indexOf(obj._id).should.not.equal(-1);
      idx.getMatching('aa').indexOf(obj2._id).should.not.equal(-1);
      idx.getMatching('cc').length.should.equal(1);

      idx.remove(obj2);
      idx.getMatching('aa').length.should.equal(1);
      idx.getMatching('aa').indexOf(obj._id).should.not.equal(-1);
      idx.getMatching('aa').indexOf(obj2._id).should.equal(-1);
      idx.getMatching('cc').length.should.equal(0);
    });

    it('If a unique constraint is violated when inserting an array key, roll back all inserts before the key', function () {
      var obj = { tf: ['aa', 'bb'], really: 'yeah' }
        , obj2 = { tf: ['cc', 'dd', 'aa', 'ee'], yes: 'indeed' }
        , idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        ;

      idx.insert(obj);
      idx.getAll().length.should.equal(2);
      idx.getMatching('aa').length.should.equal(1);
      idx.getMatching('bb').length.should.equal(1);
      idx.getMatching('cc').length.should.equal(0);
      idx.getMatching('dd').length.should.equal(0);
      idx.getMatching('ee').length.should.equal(0);

      (function () { idx.insert(obj2); }).should.throw();
      idx.getAll().length.should.equal(2);
      idx.getMatching('aa').length.should.equal(1);
      idx.getMatching('bb').length.should.equal(1);
      idx.getMatching('cc').length.should.equal(0);
      idx.getMatching('dd').length.should.equal(0);
      idx.getMatching('ee').length.should.equal(0);
    });

	});   // ==== End of 'Array fields' ==== //

  });   // ==== End of 'Insertion' ==== //


  describe('Removal', function () {

    it('Can remove pointers from the index, even when multiple documents have the same key', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { a: 5, tf: 'hello', _id: 1 }
        , doc2 = { a: 8, tf: 'world', _id: 2 }
        , doc3 = { a: 2, tf: 'bloup', _id: 3 }
        , doc4 = { a: 23, tf: 'world', _id: 4 }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);
      idx.tree.getNumberOfKeys().should.equal(3);

      idx.remove(doc1);
      idx.tree.getNumberOfKeys().should.equal(2);
      idx.tree.search('hello').length.should.equal(0);

      idx.remove(doc2);
      idx.tree.getNumberOfKeys().should.equal(2);
      idx.tree.search('world').length.should.equal(1);
      idx.tree.search('world')[0].should.equal(doc4._id);
    });

    it('If we have a sparse index, removing a non indexed doc has no effect', function () {
      var idx = new CollectionIndex({ fieldName: 'nope', sparse: true })
        , doc1 = { a: 5, tf: 'hello' }
        , doc2 = { a: 5, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.tree.getNumberOfKeys().should.equal(0);

      idx.remove(doc1);
      idx.tree.getNumberOfKeys().should.equal(0);
    });

    it('Works with dot notation', function () {
      var idx = new CollectionIndex({ fieldName: 'tf.nested' })
        , doc1 = { _id: 5, tf: { nested: 'hello' } }
        , doc2 = { _id: 8, tf: { nested: 'world', additional: true } }
        , doc3 = { _id: 2, tf: { nested: 'bloup', age: 42 } }
        , doc4 = { _id: 2, tf: { nested: 'world', fruits: ['apple', 'carrot'] } }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);
      idx.tree.getNumberOfKeys().should.equal(3);

      idx.remove(doc1);
      idx.tree.getNumberOfKeys().should.equal(2);
      idx.tree.search('hello').length.should.equal(0);

      idx.remove(doc2);
      idx.tree.getNumberOfKeys().should.equal(2);
      idx.tree.search('world').length.should.equal(1);
      idx.tree.search('world')[0].should.equal(doc4._id);
    });

  });   // ==== End of 'Removal' ==== //


  describe('Update', function () {

    it('Can update a document whose key did or didnt change', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 8, tf: 'world' }
        , doc3 = { _id: 2, tf: 'bloup' }
        , doc4 = { _id: 23, tf: 'world' }
        , doc5 = { _id: 1, tf: 'changed' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('world'), [doc2._id]);

      idx.update(doc2, doc4);
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('world'), [doc4._id]);

      idx.update(doc1, doc5);
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('hello'), []);
      assert.deepEqual(idx.tree.search('changed'), [doc5._id]);
    });

    it('If a simple update violates a unique constraint, changes are rolled back and an error thrown', function () {
      var idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 8, tf: 'world' }
        , doc3 = { _id: 2, tf: 'bloup' }
        , bad = { _id: 23, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('hello'), [doc1._id]);
      assert.deepEqual(idx.tree.search('world'), [doc2._id]);
      assert.deepEqual(idx.tree.search('bloup'), [doc3._id]);

      (() => idx.update(doc3, bad)).should.throw(Error);

      // No change
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('hello'), [doc1._id]);
      assert.deepEqual(idx.tree.search('world'), [doc2._id]);
      assert.deepEqual(idx.tree.search('bloup'), [doc3._id]);
    });

    it('If an update doesnt change a document, the unique constraint is not violated', function () {
      var idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 8, tf: 'world' }
        , doc3 = { _id: 2, tf: 'bloup' }
        , noChange = { _id: 8, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('world'), [doc2._id]);

      idx.update(doc2, noChange);   // No error thrown
      idx.tree.getNumberOfKeys().should.equal(3);
      assert.deepEqual(idx.tree.search('world'), [noChange._id]);
    });

  });   // ==== End of 'Update' ==== //


  describe('Get matching documents', function () {

    it('Get all documents where fieldName is equal to the given value, or an empty array if no match', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 8, tf: 'world' }
        , doc3 = { _id: 2, tf: 'bloup' }
        , doc4 = { _id: 23, tf: 'world' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);

      assert.deepEqual(idx.getMatching('bloup'), [doc3._id]);
      assert.deepEqual(idx.getMatching('world'), [doc2._id, doc4._id]);
      assert.deepEqual(idx.getMatching('nope'), []);
    });

    it('Can get all documents for a given key in a unique index', function () {
      var idx = new CollectionIndex({ fieldName: 'tf', unique: true })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 8, tf: 'world' }
        , doc3 = { _id: 2, tf: 'bloup' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      assert.deepEqual(idx.getMatching('bloup'), [doc3._id]);
      assert.deepEqual(idx.getMatching('world'), [doc2._id]);
      assert.deepEqual(idx.getMatching('nope'), []);
    });

    it('Can get all documents for which a field is undefined', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 2, nottf: 'bloup' }
        , doc3 = { _id: 8, tf: 'world' }
        , doc4 = { _id: 7, nottf: 'yes' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      assert.deepEqual(idx.getMatching('bloup'), []);
      assert.deepEqual(idx.getMatching('hello'), [doc1._id]);
      assert.deepEqual(idx.getMatching('world'), [doc3._id]);
      assert.deepEqual(idx.getMatching('yes'), []);
      assert.deepEqual(idx.getMatching(undefined), [doc2._id]);

      idx.insert(doc4);

      assert.deepEqual(idx.getMatching('bloup'), []);
      assert.deepEqual(idx.getMatching('hello'), [doc1._id]);
      assert.deepEqual(idx.getMatching('world'), [doc3._id]);
      assert.deepEqual(idx.getMatching('yes'), []);
      assert.deepEqual(idx.getMatching(undefined), [doc2._id, doc4._id]);
    });

    it('Can get all documents for which a field is null', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 2, tf: null }
        , doc3 = { _id: 8, tf: 'world' }
        , doc4 = { _id: 7, tf: null }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      assert.deepEqual(idx.getMatching('bloup'), []);
      assert.deepEqual(idx.getMatching('hello'), [doc1._id]);
      assert.deepEqual(idx.getMatching('world'), [doc3._id]);
      assert.deepEqual(idx.getMatching('yes'), []);
      assert.deepEqual(idx.getMatching(null), [doc2._id]);

      idx.insert(doc4);

      assert.deepEqual(idx.getMatching('bloup'), []);
      assert.deepEqual(idx.getMatching('hello'), [doc1._id]);
      assert.deepEqual(idx.getMatching('world'), [doc3._id]);
      assert.deepEqual(idx.getMatching('yes'), []);
      assert.deepEqual(idx.getMatching(null), [doc2._id, doc4._id]);
    });

    it('Can get all documents for a given key in a sparse index, but not unindexed docs (= field undefined)', function () {
      var idx = new CollectionIndex({ fieldName: 'tf', sparse: true })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 2, nottf: 'bloup' }
        , doc3 = { _id: 8, tf: 'world' }
        , doc4 = { _id: 7, nottf: 'yes' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);

      assert.deepEqual(idx.getMatching('bloup'), []);
      assert.deepEqual(idx.getMatching('hello'), [doc1._id]);
      assert.deepEqual(idx.getMatching('world'), [doc3._id]);
      assert.deepEqual(idx.getMatching('yes'), []);
      assert.deepEqual(idx.getMatching(undefined), []);
    });

    it('Can get all documents whose key is in an array of keys', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 2, tf: 'bloup' }
        , doc3 = { _id: 8, tf: 'world' }
        , doc4 = { _id: 7, tf: 'yes' }
        , doc5 = { _id: 7, tf: 'yes' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);
      idx.insert(doc5);

      assert.deepEqual(idx.getMatching([]), []);
      assert.deepEqual(idx.getMatching(['bloup']), [doc2._id]);
      assert.deepEqual(idx.getMatching(['bloup', 'yes']), [doc2._id, doc4._id, doc5._id]);
      assert.deepEqual(idx.getMatching(['hello', 'no']), [doc1._id]);
      assert.deepEqual(idx.getMatching(['nope', 'no']), []);
    });

    it('Can get all documents whose key is between certain bounds', function () {
      var idx = new CollectionIndex({ fieldName: '_id' })
        , doc1 = { _id: 5, tf: 'hello' }
        , doc2 = { _id: 2, tf: 'bloup' }
        , doc3 = { _id: 8, tf: 'world' }
        , doc4 = { _id: 7, tf: 'yes' }
        , doc5 = { _id: 10, tf: 'yes' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);
      idx.insert(doc4);
      idx.insert(doc5);

      assert.deepEqual(idx.getBetweenBounds({ $lt: 10, $gte: 5 }), [ doc1._id, doc4._id, doc3._id ]);
      assert.deepEqual(idx.getBetweenBounds({ $lte: 8 }), [ doc2._id, doc1._id, doc4._id, doc3._id ]);
      assert.deepEqual(idx.getBetweenBounds({ $gt: 7 }), [ doc3._id, doc5._id ]);
    });

  });   // ==== End of 'Get matching documents' ==== //


  describe('Resetting', function () {

    it('Can reset an index without any new data, the index will be empty afterwards', function () {
      var idx = new CollectionIndex({ fieldName: 'tf' })
        , doc1 = { a: 5, tf: 'hello' }
        , doc2 = { a: 8, tf: 'world' }
        , doc3 = { a: 2, tf: 'bloup' }
        ;

      idx.insert(doc1);
      idx.insert(doc2);
      idx.insert(doc3);

      idx.tree.getNumberOfKeys().should.equal(3);
      idx.getMatching('hello').length.should.equal(1);
      idx.getMatching('world').length.should.equal(1);
      idx.getMatching('bloup').length.should.equal(1);

      idx.reset();
      idx.tree.getNumberOfKeys().should.equal(0);
      idx.getMatching('hello').length.should.equal(0);
      idx.getMatching('world').length.should.equal(0);
      idx.getMatching('bloup').length.should.equal(0);
    });
  });   // ==== End of 'Resetting' ==== //

  it('Get all elements in the index', function () {
    var idx = new CollectionIndex({ fieldName: 'a' })
      , doc1 = { a: 5, _id: 'hello' }
      , doc2 = { a: 8, _id: 'world' }
      , doc3 = { a: 2, _id: 'bloup' }
      ;

    idx.insert(doc1);
    idx.insert(doc2);
    idx.insert(doc3);

    assert.deepEqual(idx.getAll(), ['bloup', 'hello', 'world']);
  });


});
