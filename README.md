# callbag-redux

![LICENSE](https://img.shields.io/npm/l/callbag-redux.svg)
![VERSION](https://img.shields.io/badge/callbag--redux-0.1.0-yellow.svg)
![DOWNLOADS](https://img.shields.io/npm/dt/callbag-redux.svg)
![GITHUB-STARS](https://img.shields.io/github/stars/ENvironmentSet/callbag-redux.svg)
![LAST-COMMIT](https://img.shields.io/github/last-commit/ENvironmentSet/callbag-redux.svg)

callbag-redux is reimplementation of redux using callbag

## API

### store(reducer, [preloadedState])

| Argument | Description |
|----------|-------------|
| reducer  | reducer of store. |
| preloadedState | initial state of store. | 

* returns newly created `Store`

According to redux's rule, Usage of FSA(Flux-Standard-Action) and Pure reducer is recommended.

Examples:

```js
import { store } from 'callbag-redux';
import reducer from './ducks'; // let's say here is an root reducer

const myStore = store(reducer, { count: 0 });
```

----

### Store(start, sink)

| Argument | Description |
|----------|-------------|
| start | to greet the store. |
| sink | sink for store. | 

> **NOTICE**: `or` is alias of `|`(union type)

Store is an Callbag that calculates and propagate it's state.

Examples:

Subscribing store
```js
import { store } from 'callbag-redux';
import reducer from './ducks'; // let's say here is an root reducer

const myStore = store(reducer, { count: 0 });
const simpleSubscribe = store => subscriber => {
  //store dispatches each new state when state is calculated
  store(0, (t, d) => {
    if (t === 1) subscriber(d);
  });
};

simpleSubscribe(store)(console.log);
```

Dispatching action to store
```js
import { store } from 'callbag-redux';
import reducer from './ducks'; // let's say here is an root reducer

const myStore = store(reducer, { count: 0 });
const simpleDispatch = store => action$ => {
  store(0, (t, d) => {
    if (t === 0) {
      action$(0, d);
    }
  });
};
const twice = data => (start, sink) => {
  if (start !== 0) return;

  sink(1, data);
  sink(1, data);
  sink(2);
};

simpleDispatch(store)(twice({ type: 'INCREASE' }));
```

#### dispatch(store)(source)

| Argument | Description |
|----------|-------------|
| store  | store which will take actions from this. |
| source  | source of action which will be dispatched. |

dispatch is an source that dispatches each action of given action stream to given store.

Examples:

```js
import { store, dispatch } from 'callbag-redux';
import reducer from './ducks'; // let's say here is an root reducer

const myStore = store(reducer, { count: 0 });
const twice = data => (start, sink) => {
  if (start !== 0) return;

  sink(1, data);
  sink(1, data);
  sink(2);
};

dispatch(store)(twice({ type: 'INCREASE' }));
```

#### subscribe(store)(subscriber)

| Argument | Description |
|----------|-------------|
| store  | store which will notice subscriber with it's current state. |
| subscriber  | function which will be noticed by store when it's state is changed |

subscribe is an listener that subscribes given store with given subscriber.

```js
import { store, subscribe } from 'callbag-redux';
import reducer from './ducks'; // let's say here is an root reducer

const myStore = store(reducer, { count: 0 });

subscribe(store)(console.log);
```

----

### combineReducers(reducers)

| Argument | Description |
|----------|-------------|
| reducers  | map of reducers |

* returns combined root reducer

combineReducers is a function that combines set of reducer into one root reducer.

Examples:

```js
import { store, subscribe, dispatch, combineReducers } from 'callbag-redux';

const interval = time => (start, sink) => {
  if (start !== 0) return;

  setInterval(() => {
    sink(1);
  }, time)
};

const map = transformer => a$ => (start, sink) => {
  if (start !== 0) return;

  a$(0, (t, d) => {
    sink(t, t === 1 ? transformer(d) : d);
  });
};

function counterReducer(count = 0, action) {
  switch (action.type) {
    case 'INCREASE':
      return count + 1;
    case 'DECREASE':
      return count - 1;
    default :
      return count;
  }
}

function memoReducer(memo = '', action) {
  switch (action.type) {
    case 'SET':
      return action.payload;
    default :
      return memo;
  }
}

const reducer = combineReducers({
  count: counterReducer,
  memo: memoReducer,
});
const myStore = store(reducer);

subscribe(myStore)(({ count }) => console.log(`count: ${count}`));
subscribe(myStore)(({ memo }) => console.log(`memo: ${memo}`));

dispatch(myStore)(map(() => ({ type: 'INCREASE' }))(interval(1000)));
dispatch(myStore)(map(() => ({ type: 'SET', payload: `It's ${Date.now()}` }))(interval(2000)));
```

----