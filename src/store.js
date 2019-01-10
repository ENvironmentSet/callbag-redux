import enhance from './enhance';

export const store = enhance();

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
