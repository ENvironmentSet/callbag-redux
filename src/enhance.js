const INIT = {
  type: '@@INIT',
};
const id = (_, producer) => producer(0, producer);

export default function enhance(onAction = id) {
  return (reducer, preloadedState = reducer(undefined, INIT)) => {
    let state = preloadedState;
    let subscribers = [];

    return (start, sink) => {
      if (start !== 0) return;
      const subscriber = () => sink(1, state);
      const subscriberIndex = subscribers.push(subscriber) - 1;

      onAction(0, (t, d) => {
        if (t === 0) {
          sink(0, (t, action) => {
            if (t === 1) {
              d(1, action);
            } else if (t === 2) {
              subscribers.splice(subscriberIndex, 1);
            }
          });
        } else if (t === 1) {
          state = reducer(state, d);
          subscribers.forEach(subscriber => subscriber());
        }
      });
    };
  };
};