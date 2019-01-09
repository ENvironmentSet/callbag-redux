const INIT = {
  type: '@@INIT',
};

export const store = (reducer, preloadedState = reducer(undefined, INIT)) => {
  let state = preloadedState;
  let subscribers = [];

  return (start, sink) => {
    if (start !== 0) return;
    const subscriber = () => sink(1, state);
    const subscriberIndex = subscribers.push(subscriber) - 1;

    sink(0, (t, d) => {
      if (t === 1) {
        state = reducer(state, d);
        subscribers.forEach(subscriber => subscriber());
      } else if (t === 2) {
        subscribers.splice(subscriberIndex, 1);
      }
    });
  };
};

export const dispatch = store => action$ => {
  store(0, (t, d) => {
    if (t === 0) {
      action$(0, d);
    }
  });
};

export const subscribe = store => subscriber => {
  let unsubscribe;

  store(0, (t, d) => {
    if (t === 0) {
      unsubscribe = () => d(2);
    } else if (t === 1) {
      subscriber(d, unsubscribe);
    }
  })
};
