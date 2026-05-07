'use client';

import { type ComponentProps, memo } from 'react';

import { useMotionProps, useReducedMotion } from '@/design/ui/hooks';

import {
	Popover as HeroUIPopover,
	PopoverContent,
	PopoverTrigger,
	usePopoverContext,
} from '@heroui/popover';
import {
	type InternalForwardRefRenderFunction,
	extendVariants,
} from '@heroui/system';

import { generateRatingVariants } from '@/design/ui/utils';

const CustomHeroUIPopover = extendVariants(
	HeroUIPopover,
	generateRatingVariants('content')
);

interface IProps extends ComponentProps<typeof CustomHeroUIPopover> {
	disableBlur?: boolean;
}

export default memo<IProps>(function Popover({
	color,
	disableAnimation,
	disableBlur: _disableBlur,
	offset,
	shouldBlockScroll,
	shouldCloseOnScroll,
	showArrow,
	size,
	...props
}) {
	const motionProps = useMotionProps('popover');
	const isReducedMotion = useReducedMotion();

	return (
		<CustomHeroUIPopover
			color={color}
			disableAnimation={disableAnimation ?? isReducedMotion}
			motionProps={motionProps}
			// The same offset position as `Tooltip`.
			offset={
				typeof offset === 'number'
					? offset +
						(size === 'sm' && !showArrow ? -3 : showArrow ? 1 : -3)
					: (offset as unknown as number)
			}
			shouldBlockScroll={Boolean(shouldBlockScroll)}
			shouldCloseOnScroll={Boolean(shouldCloseOnScroll)}
			showArrow={Boolean(showArrow)}
			size={size}
			{...props}
		/>
	);
}) as InternalForwardRefRenderFunction<'div', IProps>;

export type { IProps as IPopoverProps };

export { PopoverContent, PopoverTrigger, usePopoverContext };
export type { PopoverContentProps, PopoverTriggerProps } from '@heroui/popover';
