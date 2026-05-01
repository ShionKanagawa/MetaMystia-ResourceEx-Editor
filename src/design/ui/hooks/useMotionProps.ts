import { useMemo } from 'react';

const MOTION_DEFAULT = {} as const;

const MOTION_POPOVER = {
	variants: {
		enter: {
			transform: 'scale(1)',
			transition: { bounce: 0, duration: 0.3, type: 'spring' },
		},
		exit: {
			opacity: 0,
			transform: 'scale(0.96)',
			transition: { bounce: 0, duration: 0.15, type: 'easeOut' },
		},
		initial: { transform: 'scale(0.8)' },
	},
} as const;

const MOTION_SELECT = {
	variants: {
		enter: {
			transform: 'scale(1)',
			transition: { bounce: 0, duration: 0.15, type: 'easeIn' },
		},
		exit: {
			opacity: 0,
			transform: 'scale(0.96, 1)',
			transition: { bounce: 0, duration: 0.3, type: 'easeOut' },
		},
		initial: { transform: 'scale(0.96, 1)' },
	},
} as const;

const MOTION_TOOLTIP = {
	variants: {
		enter: {
			transform: 'scale(1)',
			transition: { bounce: 0, duration: 0.1, type: 'spring' },
		},
		exit: {
			transform: 'scale(0)',
			transition: { bounce: 0, duration: 0.1, type: 'easeOut' },
		},
		initial: { transform: 'scale(0.8)' },
	},
} as const;

const MOTION_PROP_MAP = {
	default: MOTION_DEFAULT,
	popover: MOTION_POPOVER,
	select: MOTION_SELECT,
	tooltip: MOTION_TOOLTIP,
} as const;

type TMotionPropMap = typeof MOTION_PROP_MAP;
type TMotionType = Exclude<keyof TMotionPropMap, 'default'>;

export function getMotionProps<T extends TMotionType>(
	type: T
): TMotionPropMap[T] {
	return MOTION_PROP_MAP[type];
}

const EMPTY_MOTION_PROPS = MOTION_PROP_MAP.default;

// `isHighAppearance` is currently disabled in this editor, so motion is always reduced.
// Returning the default (empty) motion props matches the previous behavior of
// `getMotionProps(type, /* isHighAppearance */ false)`.
export function useMotionProps<T extends TMotionType>(_type: T) {
	return useMemo(() => EMPTY_MOTION_PROPS, []);
}
