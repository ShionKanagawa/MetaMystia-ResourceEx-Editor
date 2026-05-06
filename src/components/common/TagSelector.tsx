import { TagButton } from './TagButton';

interface TagSelectorProps {
	tags: number[];
	tagPool: { id: number; name: string }[];
	onToggle: (tagId: number) => void;
	variant?: 'normal' | 'ban';
}

export function TagSelector({
	tags,
	tagPool,
	onToggle,
	variant = 'normal',
}: TagSelectorProps) {
	return (
		<div className="flex flex-wrap gap-2 rounded-xl border border-black/10 bg-white/40 p-4 dark:border-white/10 dark:bg-black/10">
			{tagPool.map((tag) => {
				const isSelected = tags.includes(tag.id);
				return (
					<TagButton
						key={tag.id}
						tag={tag}
						isSelected={isSelected}
						onClick={() => onToggle(tag.id)}
						variant={variant}
					/>
				);
			})}
		</div>
	);
}
