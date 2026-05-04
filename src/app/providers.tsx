'use client';

import { type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';

import { HeroUIProvider } from '@heroui/system';
import { DataProvider } from '@/components/context/DataContext';
import { AnnouncementModal } from '@/components/common/AnnouncementModal';

export default function Providers({ children }: PropsWithChildren) {
	const router = useRouter();

	return (
		<HeroUIProvider locale="zh-CN" navigate={router.push}>
			<DataProvider>
				{children}
				<AnnouncementModal />
			</DataProvider>
		</HeroUIProvider>
	);
}
