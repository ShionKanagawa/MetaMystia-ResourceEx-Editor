'use client';

import { type ComponentProps, memo } from 'react';

import { useMotionProps, useReducedMotion } from '@/design/ui/hooks';

import {
	type InternalForwardRefRenderFunction,
	extendVariants,
} from '@heroui/system';
import { Tooltip as HeroUITooltip } from '@heroui/tooltip';

import { generateRatingVariants } from '@/design/ui/utils';

const CustomHeroUITooltip = extendVariants(
	HeroUITooltip,
	generateRatingVariants('content')
);

interface IProps extends ComponentProps<typeof CustomHeroUITooltip> {
	disableBlur?: boolean;
}

export default memo<IProps>(function Tooltip({
	color,
	disableAnimation,
	disableBlur: _disableBlur,
	radius,
	showArrow,
	...props
}) {
	const motionProps = useMotionProps('tooltip');
	const isReducedMotion = useReducedMotion();

	return (
		<CustomHeroUITooltip
			color={color}
			disableAnimation={disableAnimation ?? isReducedMotion}
			motionProps={motionProps}
			// The same radius as `Popover`.
			radius={radius ?? 'lg'}
			showArrow={Boolean(showArrow)}
			{...props}
		/>
	);
}) as InternalForwardRefRenderFunction<'div', IProps>;

export type { IProps as ITooltipProps };
