import { type ReactNode } from 'react';
import { cn } from '@/design/ui/utils';

interface WarningNoticeProps {
	children: ReactNode;
	className?: string;
}

export function WarningNotice({ children, className }: WarningNoticeProps) {
	return (
		<div
			className={cn(
				'rounded bg-warning/10 p-2 text-xs text-warning-600 dark:text-warning-400',
				className
			)}
		>
			{children}
		</div>
	);
}
