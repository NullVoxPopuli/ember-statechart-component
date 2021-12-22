/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyMap = Map<any, any>;
type Fn = (...args: any[]) => any;

/**
 * There is something wierd about maps where they seem
 * to not be able to be reasonably proxied...
 */
export function createMapWithInterceptedSet(source: AnyMap, overrides: Record<string, Fn>): AnyMap {
  class InterceptableMap<K = unknown, V = unknown> implements Map<K, V> {
    clear(): void {
      source.clear();
    }
    delete(key: K): boolean {
      return source.delete(key);
    }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, _thisArg?: any): void {
      source.forEach(callbackfn);
    }
    get(key: K): V | undefined {
      return source.get(key);
    }
    has(key: K): boolean {
      return source.has(key);
    }
    set(key: K, value: V): this {
      if (!('set' in overrides)) {
        throw new Error('set override is missing');
      }

      overrides.set(key, value);

      return this;
    }
    get size() {
      return source.size;
    }
    entries(): IterableIterator<[K, V]> {
      return source.entries();
    }
    keys(): IterableIterator<K> {
      return source.keys();
    }
    values(): IterableIterator<V> {
      return source.values();
    }
    [Symbol.iterator](): IterableIterator<[K, V]> {
      return source[Symbol.iterator]();
    }
    get [Symbol.toStringTag]() {
      return source[Symbol.toStringTag];
    }
  }

  return new InterceptableMap();
}
