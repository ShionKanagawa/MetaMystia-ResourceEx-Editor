import { useCallback } from 'react';
import { EditorField } from './EditorField';
import { TagSelector } from './TagSelector';

interface TagsFieldProps {
	label: string;
	tags: number[];
	tagPool: { id: number; name: string }[];
	onChange: (newTags: number[]) => void;
	variant?: 'normal' | 'ban';
}

export function TagsField({
	label,
	tags,
	tagPool,
	onChange,
	variant = 'normal',
}: TagsFieldProps) {
	const toggleTag = useCallback(
		(tagId: number) => {
			const exists = tags.includes(tagId);

			let newTags;
			if (exists) {
				newTags = tags.filter((id) => id !== tagId);
			} else {
				newTags = [...tags, tagId];
			}

			newTags.sort((a, b) => a - b);

			onChange(newTags);
		},
		[tags, onChange]
	);

	return (
		<EditorField label={label}>
			<TagSelector
				tags={tags}
				tagPool={tagPool}
				onToggle={toggleTag}
				variant={variant}
			/>
		</EditorField>
	);
}
