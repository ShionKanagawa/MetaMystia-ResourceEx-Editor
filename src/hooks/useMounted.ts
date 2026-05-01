'use client';

import { type EffectCallback, useEffect, useRef, useState } from 'react';

function useMounted(callback?: EffectCallback) {
	const isFired = useRef(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		if (!isFired.current) {
			isFired.current = true;
			setIsMounted(true);
			return callback?.();
		}
	}, [callback]);

	return isMounted;
}

export { useMounted };
