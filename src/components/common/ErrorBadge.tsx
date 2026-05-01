import { type ReactNode } from 'react';
import { cn } from '@/design/ui/utils';

interface ErrorBadgeProps {
	children: ReactNode;
	className?: string;
}

export function ErrorBadge({ children, className }: ErrorBadgeProps) {
	return (
		<span
			className={cn(
				'rounded bg-danger px-1.5 py-0.5 text-[10px] font-medium text-white',
				className
			)}
		>
			{children}
		</span>
	);
}
