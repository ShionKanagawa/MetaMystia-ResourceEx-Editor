'use client';

import { type JSX, memo } from 'react';

import { useReducedMotion } from '@/design/ui/hooks';

import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	type NavbarProps,
} from '@heroui/navbar';

interface IProps extends NavbarProps {}

export default memo<IProps>(function Navbar({
	disableAnimation,
	...props
}: IProps) {
	const isReducedMotion = useReducedMotion();

	return (
		<HeroUINavbar
			disableAnimation={disableAnimation ?? isReducedMotion}
			{...props}
		/>
	);
}) as { (props: IProps): JSX.Element; displayName: string };

export type { IProps as INavbarProps };

export {
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
};
export type {
	NavbarBrandProps,
	NavbarContentProps,
	NavbarItemProps,
	NavbarMenuProps,
	NavbarMenuItemProps,
	NavbarMenuToggleProps,
} from '@heroui/navbar';
