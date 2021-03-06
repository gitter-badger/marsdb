<div style="text-align:center"><img src="https://static.studytime.me/marsdb.png" /></div>

MarsDB
=========

[![Build Status](https://travis-ci.org/c58/marsdb.svg?branch=master)](https://travis-ci.org/c58/marsdb)
[![npm version](https://badge.fury.io/js/marsdb.svg)](https://www.npmjs.com/package/marsdb)
[![Coverage Status](https://coveralls.io/repos/c58/marsdb/badge.svg?branch=master&service=github)](https://coveralls.io/github/c58/marsdb?branch=master)
[![Dependency Status](https://david-dm.org/c58/marsdb.svg)](https://david-dm.org/c58/marsdb)

MarsDB is a lightweight client-side database.
It's based on a Meteor’s `minimongo` matching/modifying implementation. It's carefully written on `ES6`, have a `Promise` based interface and may be backed with any storage implementation (LevelUP, LocalStorage, IndexedDB, etc). For now implemented only LocalStorage and [LocalForage](https://github.com/mozilla/localForage) storage managers. It's also supports `observable` cursors.

MarsDB supports any kind of find/update/remove operations that Meteor’s minimongo does. So, go to the Meteor docs for supported query/modifier operations.

You can use it in any JS environment (Browser, Electron, NW.js, Node.js).

## Features

* **Promise based API**
* **Carefully written on ES6**
* **Supports many of MongoDB query/modify operations** – thanks to a Meteor’s minimongo
* **Flexible pipeline** – map, reduce, custom sorting function, filtering. All with a sexy JS interface (no ugly mongo’s aggregation language)
* **Persistence API** – all collections can be stored (and restored) with any kind of storage (in-memory, LocalStorage, LevelUP, etc)
* **Observable queries** - live queries just like in Meteor, but with simplier interface
* **Reactive joins** – out of the box

## Examples

### Using within non-ES6 environment
The `./dist` folder contains already compiled to a ES5 code, but some polyfills needed. For using in a browser you must to include `marsdb.polyfills.js` before `marsdb.min.js`. In node.js you need to `require(‘marsdb/polyfills’)`.
It sets in a window/global: Promise, Set and Symbol.

### Create a collection
```javascript
import Collection from ‘marsdb’;
import LocalStorageManager from 'marsdb/lib/LocalStorageManager';

// Setup different id generator and storage managers
// Default storage is in-memory
Collection.defaultStorageManager(LocalStorageManager);
Collection.defaultIdGenerator(() => {
  return {
    value: Math.random(),
    seed: 0,
  };
});

const users = new Collection(‘users’);
```
### Find a documents
```javascript
const posts = new Collection(‘posts’);
posts.find({author: ‘Bob’})
  .sort([‘createdAt’])
  .then(docs => {
    // do something with docs
  });
```
### Find with pipeline (map, reduce, filter)
An order of pipeline methods invokation is important. Next pipeline operation gives as argument a result of a previous operation.
```javascript
const posts = new Collection(‘posts’);

// Get number of all comments in the DB
posts.find()
  .limit(10)
  .sortFunc((a, b) => a - b + 10)
  .filter(doc => Matsh.sqrt(doc.comment.length) > 1.5)
  .map(doc => doc.comments.length)
  .reduce((acum, val) => acum + val)
  .then(result => {
    // result is a number of all comments
    // in all found posts
  });

// Result is `undefined` because posts
// is not exists and additional processing
// is not ran (thanks to `.ifNotEmpty()`)
posts.find({author: 'not_existing_name'})
  .aggregate(docs => docs[0])
  .ifNotEmpty()
  .aggregate(user => user.name)
```
### Find with observing changes
Observable cursor returned only by a `find` method of a collection. Updates of the cursor is batched and debounced (default batch size is `20` and debounce time is `1000 / 15` ms). You can change the paramters by `batchSize` and `debounce` methods of an observable cursor (methods is chained).

```javascript
const posts = new Collection(‘posts’);
const stopper = posts.find({tags: {$in: [‘marsdb’, ‘is’, ‘awesome’]}})
  .observe(docs => {
    // invoked on every result change
    // (on initial result too)
    stopper.stop(); // stops observing
  }).then(docs => {
    // invoked once on initial result
    // (after `observer` callback)
  });
```

### Find with joins
```javascript
const users = new Collection(‘users’);
const posts = new Collection(‘posts’);
posts.find()
  .join(doc => {
    // Return a Promise for waiting of the result.
    return users.findOne(doc.authorId).then(user => {
      doc.authorObj = user;
      // any return is ignored
    });
  })
  .join(doc => {
    // For reactive join you must invoke `observe` instead `then`
    // That's it!
    return users.findOne(doc.authorId).observe(user => {
      doc.authorObj = user;
    });
  })
  .join((doc, updated) => {
    // Also any other “join” mutations supported
    doc.another = _cached_data_by_post[doc._id];

    // Manually update a joined parameter and propagate
    // update event from current cursor to a root
    // (`observe` callback invoked)
    setTimeout(() => {
      doc.another = 'some another user';
      updated();
    }, 10);
  })
  .observe((posts) => {
    // do something with posts with authors
    // invoked any time when posts changed
    // (and when observed joins changed too)
  })
```
### Inserting
```javascript
const posts = new Collection(‘posts’);
posts.insert({text: ‘MarsDB is awesome’}).then(docId => {
  // Invoked after persisting document
})
posts.insertAll(
  {text: ‘MarsDB’},
  {text: ‘is’},
  {text: ‘awesome’}
).then(docsIds => {
  // invoked when all documents inserted
});
```
### Updating
```javascript
const posts = new Collection(‘posts’);
posts.update(
  {authorId: {$in: [1, 2, 3]}},
  {$set: {text: ‘noop’}}
).then(result => {
  console.log(result.modified) // count of modified docs
  console.log(result.updated) // array of updated docs
  console.log(result.original) // array of original docs
});
```
### Removing
```javascript
const posts = new Collection(‘posts’);
posts.remove({authorId: {$in: [1,2,3]}})
  .then(removedDocs => {
    // do something with removed documents array
  });
```

## Roadmap
* Keep track of multiple remove/update documents in selector (allow only if opations.multi passed)
* Upsert updating
* Indexes support for some kind of simple requests {a: '^b'}, {a: {$lt: 9}}
* Some set of backends
* Documentation

## Contributing
I’m waiting for your pull requests and issues.
Don’t forget to execute `gulp lint` before requesting. Accepted only requests without errors.

## License
See [License](LICENSE)