export interface ResolvablePromise<T> extends Promise<T> {
  resolve: (value: T) => void;
  resolved: boolean;
}

export const createResolvablePromise = <T>(): ResolvablePromise<T> => {
  const resolved = false;
  let resolve: ((value: T | PromiseLike<T>) => void) = () => undefined;
  const promise = new Promise<T>((res) => {
    resolve = res;
  }) as ResolvablePromise<T>;
  Object.defineProperty(promise, 'resolved', {
    enumerable: false,
    configurable: false,
    get: () => resolved,
  });
  Object.defineProperty(promise, 'resolve', {
    enumerable: false,
    configurable: false,
    get: () => resolve,
  });
  return promise as ResolvablePromise<T>;
};
