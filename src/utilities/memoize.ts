type TFunction = (...args: any[]) => any;
type TFirstParameterType<T extends TFunction> = Parameters<T>[0];

type TCache<T extends TFunction> =
	| WeakMap<object, ReturnType<T>>
	| Map<any, ReturnType<T>>;

type TMemoizedFn<T extends TFunction> = T & { cache: TCache<T> };

export function memoize<T extends TFunction>(
	fn: T,
	cacheType?: 'Map' | 'WeakMap'
) {
	const useWeakMap = cacheType === 'WeakMap';

	const cache = (useWeakMap ? new WeakMap() : new Map()) as TCache<T>;

	const memoizedFn = function (this: unknown, ...args: Parameters<T>) {
		const cacheKey = args[0] as TFirstParameterType<T>;

		if (useWeakMap && (typeof cacheKey !== 'object' || cacheKey === null)) {
			throw new TypeError(
				'[utilities/memoize]: WeakMap only supports objects as keys'
			);
		}

		if (cache.has(cacheKey)) {
			return cache.get(cacheKey) as ReturnType<T>;
		}

		const result = fn.apply(this, args) as ReturnType<T>;

		cache.set(cacheKey, result);

		return result;
	};

	memoizedFn.cache = cache;

	return memoizedFn as TMemoizedFn<T>;
}
