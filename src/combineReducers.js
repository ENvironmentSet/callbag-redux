export default function combineReducers(reducers) {
  const keys = Object.keys(reducers);

  return function reducer(state = Object.create(null), action) {
    return keys.reduce((newState, key) => {
      const reducer = reducers[key];

      newState[key] = reducer(state[key], action);

      return newState;
    }, {});
  };
};
