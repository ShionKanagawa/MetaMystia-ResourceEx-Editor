import { memo, useCallback, useId, useMemo } from 'react';

import { useData } from '@/components/context/DataContext';
import { Label } from '@/components/common/Label';
import { WarningBadge } from '@/components/common/WarningBadge';
import { cn } from '@/lib';

import type { Dialog, DialogAction, DialogActionType } from '@/types/resource';

const ACTION_TYPES: DialogActionType[] = ['CameraShake', 'CG', 'BG', 'Sound'];

const ACTION_LABEL: Record<DialogActionType, string> = {
	CameraShake: '镜头抖动',
	CG: 'CG',
	BG: 'BG',
	Sound: '音效',
};

const ACTION_FOLDER: Partial<Record<DialogActionType, string>> = {
	CG: 'assets/CG/',
	BG: 'assets/BG/',
	Sound: 'assets/Audio/',
};

type SpriteMode = 'set' | 'clear';

function getSpriteMode(action: DialogAction): SpriteMode {
	return action.shouldSet === false ? 'clear' : 'set';
}

function makeDefaultAction(type: DialogActionType): DialogAction {
	if (type === 'CameraShake') {
		return { actionType: type };
	}
	if (type === 'Sound') {
		return { actionType: type, sound: '' };
	}
	return { actionType: type, sprite: '' };
}

interface DialogActionsEditorProps {
	actions: DialogAction[] | undefined;
	onChange: (actions: DialogAction[] | undefined) => void;
}

export const DialogActionsEditor = memo<DialogActionsEditorProps>(
	function DialogActionsEditor({ actions, onChange }) {
		const list = actions ?? [];

		const update = useCallback(
			(next: DialogAction[]) => {
				onChange(next.length > 0 ? next : undefined);
			},
			[onChange]
		);

		const handleAdd = useCallback(
			(type: DialogActionType) => {
				update([...list, makeDefaultAction(type)]);
			},
			[list, update]
		);

		const handleRemove = useCallback(
			(index: number) => {
				update(list.filter((_, i) => i !== index));
			},
			[list, update]
		);

		const handleUpdate = useCallback(
			(index: number, patch: Partial<DialogAction>) => {
				const next = list.map((act, i) =>
					i === index ? ({ ...act, ...patch } as DialogAction) : act
				);
				update(next);
			},
			[list, update]
		);

		const handleMove = useCallback(
			(from: number, to: number) => {
				if (to < 0 || to >= list.length) return;
				const next = [...list];
				const [moved] = next.splice(from, 1);
				if (!moved) return;
				next.splice(to, 0, moved);
				update(next);
			},
			[list, update]
		);

		return (
			<div className="flex flex-col gap-2 rounded-lg border border-dashed border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<span className="text-xs font-medium opacity-70">
						动作列表（{list.length}）
					</span>
					<div className="flex flex-wrap gap-1">
						{ACTION_TYPES.map((type) => (
							<button
								key={type}
								type="button"
								onClick={() => {
									handleAdd(type);
								}}
								className="btn-mystia rounded-md border border-black/10 px-2 py-0.5 text-xs hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
							>
								+ {ACTION_LABEL[type]}
							</button>
						))}
					</div>
				</div>

				{list.length === 0 ? (
					<p className="py-1 text-center text-[11px] italic opacity-40">
						无附加动作
					</p>
				) : (
					<div className="flex flex-col gap-2">
						{list.map((action, index) => (
							<DialogActionRow
								key={index}
								action={action}
								index={index}
								total={list.length}
								onRemove={() => {
									handleRemove(index);
								}}
								onUpdate={(patch) => {
									handleUpdate(index, patch);
								}}
								onMoveUp={() => {
									handleMove(index, index - 1);
								}}
								onMoveDown={() => {
									handleMove(index, index + 1);
								}}
							/>
						))}
					</div>
				)}
			</div>
		);
	}
);

interface DialogActionRowProps {
	action: DialogAction;
	index: number;
	total: number;
	onUpdate: (patch: Partial<DialogAction>) => void;
	onRemove: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
}

const DialogActionRow = memo<DialogActionRowProps>(function DialogActionRow({
	action,
	index,
	total,
	onUpdate,
	onRemove,
	onMoveUp,
	onMoveDown,
}) {
	const isSpriteAction =
		action.actionType === 'CG' || action.actionType === 'BG';
	const isSoundAction = action.actionType === 'Sound';

	return (
		<div className="flex flex-col gap-2 rounded-md border border-black/10 bg-black/5 p-2 dark:border-white/10 dark:bg-white/5">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary">
						#{index + 1}
					</span>
					<span className="text-xs font-medium">
						{ACTION_LABEL[action.actionType]}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={onMoveUp}
						disabled={index === 0}
						className="btn-mystia rounded px-1 py-0.5 text-xs opacity-60 hover:bg-black/5 disabled:opacity-20 dark:hover:bg-white/5"
						title="上移"
					>
						↑
					</button>
					<button
						type="button"
						onClick={onMoveDown}
						disabled={index === total - 1}
						className="btn-mystia rounded px-1 py-0.5 text-xs opacity-60 hover:bg-black/5 disabled:opacity-20 dark:hover:bg-white/5"
						title="下移"
					>
						↓
					</button>
					<button
						type="button"
						onClick={onRemove}
						className="btn-mystia-danger rounded px-2 py-0.5 text-xs"
					>
						删除
					</button>
				</div>
			</div>

			{isSpriteAction && (
				<SpriteActionFields action={action} onUpdate={onUpdate} />
			)}
			{isSoundAction && (
				<SoundActionFields action={action} onUpdate={onUpdate} />
			)}
		</div>
	);
});

interface SpriteActionFieldsProps {
	action: DialogAction;
	onUpdate: (patch: Partial<DialogAction>) => void;
}

const SpriteActionFields = memo<SpriteActionFieldsProps>(
	function SpriteActionFields({ action, onUpdate }) {
		const mode = getSpriteMode(action);
		const folder = ACTION_FOLDER[action.actionType] ?? 'assets/';
		const radioName = useId();
		const selectId = useId();

		const { assetUrls, getAssetUrl } = useData();

		const availableAssets = useMemo(() => {
			return Object.keys(assetUrls)
				.filter((path) => path.startsWith(folder))
				.sort();
		}, [assetUrls, folder]);

		const previewUrl =
			mode === 'set' && action.sprite
				? getAssetUrl(action.sprite)
				: undefined;

		const isMissing =
			mode === 'set' &&
			!!action.sprite &&
			!availableAssets.includes(action.sprite);

		const handleModeChange = (next: SpriteMode) => {
			if (next === 'clear') {
				onUpdate({ sprite: undefined, shouldSet: false });
			} else {
				onUpdate({ shouldSet: undefined, sprite: action.sprite ?? '' });
			}
		};

		return (
			<div className="flex flex-col gap-2">
				<div className="flex flex-wrap items-center gap-3 text-xs">
					<label className="flex cursor-pointer items-center gap-1">
						<input
							type="radio"
							name={radioName}
							checked={mode === 'set'}
							onChange={() => handleModeChange('set')}
						/>
						设置图片
					</label>
					<label className="flex cursor-pointer items-center gap-1">
						<input
							type="radio"
							name={radioName}
							checked={mode === 'clear'}
							onChange={() => handleModeChange('clear')}
						/>
						清空（shouldSet:false）
					</label>
				</div>

				{mode === 'set' && (
					<div className="flex flex-col gap-2 sm:flex-row">
						<div className="bg-checkerboard flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/10 dark:border-white/10">
							{previewUrl ? (
								<img
									src={previewUrl}
									alt="预览"
									className="h-full w-full object-contain"
									draggable={false}
								/>
							) : (
								<span className="text-[10px] opacity-40">
									无预览
								</span>
							)}
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<div className="flex items-center justify-between gap-2">
								<Label
									htmlFor={selectId}
									className="text-xs normal-case opacity-70"
								>
									资产路径（来自 {folder}）
								</Label>
								{isMissing && (
									<WarningBadge>资产未注册</WarningBadge>
								)}
							</div>
							<select
								id={selectId}
								value={action.sprite ?? ''}
								onChange={(e) => {
									onUpdate({
										sprite: e.target.value || undefined,
									});
								}}
								className={cn(
									'h-8 w-full rounded-md border bg-white/40 px-2 text-xs outline-none focus:ring-2 focus:ring-black/10 dark:bg-black/10 dark:focus:ring-white/10',
									isMissing
										? 'border-warning'
										: 'border-black/10 dark:border-white/10'
								)}
							>
								<option value="">— 选择资产 —</option>
								{isMissing && (
									<option value={action.sprite}>
										{action.sprite}（缺失）
									</option>
								)}
								{availableAssets.map((path) => (
									<option key={path} value={path}>
										{path.slice(folder.length)}
									</option>
								))}
							</select>
							{availableAssets.length === 0 && (
								<p className="text-[10px] opacity-50">
									{folder} 下暂无资源，请前往「资产」页上传。
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
);

// Helper to keep Dialog typing consistent for callers that pass `Partial<Dialog>`
export type DialogActionsPatch = Pick<Dialog, 'actions'>;

interface SoundActionFieldsProps {
	action: DialogAction;
	onUpdate: (patch: Partial<DialogAction>) => void;
}

const SoundActionFields = memo<SoundActionFieldsProps>(
	function SoundActionFields({ action, onUpdate }) {
		const folder = ACTION_FOLDER.Sound ?? 'assets/Audio/';
		const selectId = useId();

		const { assetUrls, getAssetUrl } = useData();

		const availableAssets = useMemo(() => {
			return Object.keys(assetUrls)
				.filter((path) => path.startsWith(folder))
				.sort();
		}, [assetUrls, folder]);

		const previewUrl = action.sound ? getAssetUrl(action.sound) : undefined;

		const isMissing =
			!!action.sound && !availableAssets.includes(action.sound);

		return (
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between gap-2">
						<Label
							htmlFor={selectId}
							className="text-xs normal-case opacity-70"
						>
							音频路径（来自 {folder}，仅支持 .wav）
						</Label>
						{isMissing && <WarningBadge>资产未注册</WarningBadge>}
					</div>
					<select
						id={selectId}
						value={action.sound ?? ''}
						onChange={(e) => {
							onUpdate({ sound: e.target.value || undefined });
						}}
						className={cn(
							'h-8 w-full rounded-md border bg-white/40 px-2 text-xs outline-none focus:ring-2 focus:ring-black/10 dark:bg-black/10 dark:focus:ring-white/10',
							isMissing
								? 'border-warning'
								: 'border-black/10 dark:border-white/10'
						)}
					>
						<option value="">— 选择音频 —</option>
						{isMissing && (
							<option value={action.sound}>
								{action.sound}（缺失）
							</option>
						)}
						{availableAssets.map((path) => (
							<option key={path} value={path}>
								{path.slice(folder.length)}
							</option>
						))}
					</select>
					{availableAssets.length === 0 && (
						<p className="text-[10px] opacity-50">
							{folder} 下暂无音频，请前往「资产」页上传 .wav
							文件。
						</p>
					)}
				</div>
				{previewUrl && (
					<audio
						controls
						src={previewUrl}
						className="h-8 w-full"
						preload="none"
					/>
				)}
			</div>
		);
	}
);
