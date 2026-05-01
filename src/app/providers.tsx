'use client';

import { type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';

import { HeroUIProvider } from '@heroui/system';
import { DataProvider } from '@/components/context/DataContext';

export default function Providers({ children }: PropsWithChildren) {
	const router = useRouter();

	return (
		<HeroUIProvider locale="zh-CN" navigate={router.push}>
			<DataProvider>{children}</DataProvider>
		</HeroUIProvider>
	);
}
