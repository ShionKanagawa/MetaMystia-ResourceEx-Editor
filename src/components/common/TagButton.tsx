import { cn } from '@/design/ui/utils';

interface TagButtonProps {
	tag: { id: number; name: string };
	isSelected: boolean;
	onClick: () => void;
	variant?: 'normal' | 'ban';
}

export function TagButton({
	tag,
	isSelected,
	onClick,
	variant = 'normal',
}: TagButtonProps) {
	const getSelectedStyles = () => {
		if (variant === 'ban') {
			return 'border-danger bg-danger/20 text-danger shadow-sm';
		}
		return 'border-[#9d5437] bg-[#e6b4a6] text-[#830000] shadow-sm';
	};

	const getUnselectedStyles = () =>
		'border-black/20 bg-black/5 hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10';

	const getSymbol = () => (variant === 'ban' ? '✕' : '⦁');

	return (
		<button
			onClick={onClick}
			className={cn(
				'flex items-center border px-2 py-1 text-xs font-bold transition-all',
				isSelected ? getSelectedStyles() : getUnselectedStyles()
			)}
		>
			<span
				className={cn(
					'mr-1 transition-opacity',
					isSelected ? 'opacity-100' : 'opacity-40'
				)}
			>
				{getSymbol()}
			</span>
			{tag.name}
		</button>
	);
}
