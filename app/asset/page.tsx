'use client';

import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { useData } from '@/components/context/DataContext';
import { Header } from '@/components/common/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib';

// ─── Types ──────────────────────────────────────────────────────────────

interface AssetCategory {
	key: string;
	label: string;
	/** 固定目录前缀。`null` 表示自由上传，不限定子目录。 */
	folder: string | null;
	description: string;
}

const FIXED_CATEGORIES: AssetCategory[] = [
	{
		key: 'cg',
		label: 'CG',
		folder: 'assets/CG/',
		description:
			'对话动作 CG 使用的图片。文件路径示例：assets/CG/black.png',
	},
	{
		key: 'bg',
		label: 'BG',
		folder: 'assets/BG/',
		description:
			'对话动作 BG 使用的图片。文件路径示例：assets/BG/forest.png',
	},
];

const FREE_CATEGORY: AssetCategory = {
	key: 'free',
	label: '自定义',
	folder: null,
	description:
		'手动指定相对路径上传任意资源。常用于扩展用途，目前游戏只识别已知模块引用的资产。',
};

const CATEGORIES: AssetCategory[] = [...FIXED_CATEGORIES, FREE_CATEGORY];

const FIXED_FOLDERS = FIXED_CATEGORIES.map((c) => c.folder!);

function sanitizeAssetPath(path: string): string | null {
	const trimmed = path.trim().replace(/^\/+|\/+$/g, '');
	if (!trimmed) return null;
	if (trimmed.includes('..')) return null;
	// Disallow chars that are invalid on common file systems / zip entries
	if (/[\\:*?"<>|]/.test(trimmed)) return null;
	return trimmed;
}

// ─── Page ───────────────────────────────────────────────────────────────

export default function AssetPage() {
	const [activeKey, setActiveKey] = useState<string>(CATEGORIES[0]!.key);
	const activeCategory = useMemo(
		() => CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0]!,
		[activeKey]
	);

	return (
		<main className="flex min-h-screen flex-col">
			<Header />
			<div className="container mx-auto w-full max-w-7xl px-6 py-8 3xl:max-w-screen-2xl 4xl:max-w-screen-3xl">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<aside className="flex h-min flex-col gap-2 rounded-lg bg-white/10 p-4 shadow-md backdrop-blur lg:sticky lg:top-24">
						<h2 className="mb-2 text-xl font-semibold">资产分类</h2>
						{CATEGORIES.map((cat) => (
							<button
								key={cat.key}
								onClick={() => setActiveKey(cat.key)}
								className={cn(
									'btn-mystia border px-3 py-2 text-left text-foreground',
									activeKey === cat.key
										? 'border-primary bg-primary/20 shadow-inner'
										: 'border-transparent bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10'
								)}
							>
								<div className="text-sm font-bold">
									{cat.label}
								</div>
								<div className="font-mono text-[10px] opacity-60">
									{cat.folder ?? 'assets/...'}
								</div>
							</button>
						))}
						<p className="mt-4 text-[11px] leading-relaxed opacity-60">
							资产页是导出包内
							<code className="mx-1 rounded bg-black/10 px-1 dark:bg-white/10">
								assets/
							</code>
							子目录的文件浏览器。仅当资产被 dialog
							等模块引用时，导出才会包含对应文件。
						</p>
					</aside>

					<section className="lg:col-span-3">
						<AssetFolderPanel category={activeCategory} />
					</section>
				</div>
			</div>
		</main>
	);
}

// ─── Folder panel ──────────────────────────────────────────────────────

interface AssetFolderPanelProps {
	category: AssetCategory;
}

const AssetFolderPanel = memo<AssetFolderPanelProps>(function AssetFolderPanel({
	category,
}) {
	const { assetUrls, updateAsset, removeAsset } = useData();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const isFree = category.folder === null;
	const [freeFolder, setFreeFolder] = useState('assets/');
	const [isDragging, setIsDragging] = useState(false);

	const items = useMemo(() => {
		const allPaths = Object.keys(assetUrls);
		if (isFree) {
			// Free panel lists everything that's NOT under a fixed category folder.
			return allPaths
				.filter((p) => !FIXED_FOLDERS.some((f) => p.startsWith(f)))
				.sort();
		}
		return allPaths.filter((p) => p.startsWith(category.folder!)).sort();
	}, [assetUrls, category.folder, isFree]);

	const uploadToFolder = useCallback(
		async (files: FileList | File[] | null, targetFolder: string) => {
			if (!files || files.length === 0) return;
			const normalized = targetFolder.endsWith('/')
				? targetFolder
				: `${targetFolder}/`;
			for (const file of Array.from(files)) {
				if (!file.type.startsWith('image/')) {
					alert(`已跳过非图片文件: ${file.name}`);
					continue;
				}
				const safeName = file.name.replace(/[\\/:*?"<>|]/g, '_');
				const path = `${normalized}${safeName}`;
				if (
					assetUrls[path] &&
					!confirm(`已存在同名文件 ${path}，是否覆盖？`)
				) {
					continue;
				}
				const blob = new Blob([await file.arrayBuffer()], {
					type: file.type,
				});
				updateAsset(path, blob);
			}
		},
		[assetUrls, updateAsset]
	);

	const handleFixedUpload = useCallback(
		(files: FileList | null) => {
			if (!category.folder) return;
			uploadToFolder(files, category.folder);
		},
		[category.folder, uploadToFolder]
	);

	const handleFreeUpload = useCallback(
		(files: FileList | null) => {
			const sanitized = sanitizeAssetPath(freeFolder);
			if (!sanitized) {
				alert(
					'请输入有效的目标目录（相对路径，例如 assets/Misc，不能含 .. 或非法字符）'
				);
				return;
			}
			uploadToFolder(files, sanitized);
		},
		[freeFolder, uploadToFolder]
	);

	const handleRemove = useCallback(
		(path: string) => {
			if (!confirm(`确定删除 ${path} 吗？此操作不可撤销。`)) return;
			removeAsset(path);
		},
		[removeAsset]
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		if (!Array.from(e.dataTransfer?.types ?? []).includes('Files')) return;
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		if (!Array.from(e.dataTransfer?.types ?? []).includes('Files')) return;
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'copy';
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		// Only clear when leaving the wrapper itself, not crossing children.
		if (e.currentTarget === e.target) {
			setIsDragging(false);
		}
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const files = e.dataTransfer?.files ?? null;
			if (!files || files.length === 0) return;
			if (isFree) {
				handleFreeUpload(files);
			} else if (category.folder) {
				uploadToFolder(files, category.folder);
			}
		},
		[isFree, handleFreeUpload, uploadToFolder, category.folder]
	);

	return (
		<div
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={cn(
				'relative flex flex-col gap-4 rounded-lg bg-white/10 p-4 shadow-md backdrop-blur transition-colors',
				isDragging && 'ring-2 ring-primary'
			)}
		>
			{isDragging && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
					<span className="rounded-md bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow dark:bg-black/60">
						松开鼠标以上传到{' '}
						<code className="font-mono">
							{isFree ? freeFolder || 'assets/' : category.folder}
						</code>
					</span>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between gap-2">
					<h2 className="text-xl font-semibold">{category.label}</h2>
					<div className="flex items-center gap-2">
						<span className="text-xs opacity-60">
							{items.length} 个文件
						</span>
						{!isFree && (
							<button
								onClick={() => fileInputRef.current?.click()}
								className="btn-mystia-primary px-3 py-1 text-sm"
							>
								上传图片
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={(e) => {
								handleFixedUpload(e.target.files);
								e.target.value = '';
							}}
						/>
					</div>
				</div>
				<p className="text-xs opacity-60">
					{category.description} 支持将文件直接拖拽到本面板。
				</p>
			</div>

			{isFree && (
				<FreeUploadBar
					folder={freeFolder}
					onFolderChange={setFreeFolder}
					onUpload={handleFreeUpload}
				/>
			)}

			{items.length === 0 ? (
				<EmptyState
					title="暂无资产"
					description={
						isFree
							? '上方输入目标目录后点击上传，或在该目录下放置文件后重新导入资源包。'
							: '点击「上传图片」添加，或在此目录下放置文件后重新导入资源包。'
					}
				/>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
					{items.map((path) => (
						<AssetCard
							key={path}
							path={path}
							url={assetUrls[path]!}
							folder={isFree ? '' : category.folder!}
							onRemove={() => handleRemove(path)}
						/>
					))}
				</div>
			)}
		</div>
	);
});

// ─── Free upload bar ───────────────────────────────────────────────────

interface FreeUploadBarProps {
	folder: string;
	onFolderChange: (value: string) => void;
	onUpload: (files: FileList | null) => void;
}

const FreeUploadBar = memo<FreeUploadBarProps>(function FreeUploadBar({
	folder,
	onFolderChange,
	onUpload,
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex flex-col gap-2 rounded-md border border-dashed border-black/10 bg-black/5 p-3 sm:flex-row sm:items-end dark:border-white/10 dark:bg-white/5">
			<div className="flex flex-1 flex-col gap-1">
				<label className="text-[11px] font-medium opacity-70">
					目标目录（相对路径，必须以 assets/ 开头）
				</label>
				<input
					type="text"
					value={folder}
					onChange={(e) => onFolderChange(e.target.value)}
					placeholder="assets/Misc"
					className="h-9 w-full rounded-md border border-black/10 bg-white/40 px-3 font-mono text-sm text-foreground outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-black/10 dark:focus:border-white/30 dark:focus:ring-white/10"
				/>
			</div>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				className="btn-mystia-primary px-3 py-2 text-sm"
			>
				上传到此目录
			</button>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				className="hidden"
				onChange={(e) => {
					onUpload(e.target.files);
					e.target.value = '';
				}}
			/>
		</div>
	);
});

// ─── Asset card ────────────────────────────────────────────────────────

interface AssetCardProps {
	path: string;
	url: string;
	folder: string;
	onRemove: () => void;
}

const AssetCard = memo<AssetCardProps>(function AssetCard({
	path,
	url,
	folder,
	onRemove,
}) {
	const filename = path.slice(folder.length);

	const handleCopy = useCallback(() => {
		navigator.clipboard?.writeText(path).catch(() => {});
	}, [path]);

	return (
		<div className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white/40 dark:border-white/10 dark:bg-black/10">
			<div className="bg-checkerboard flex h-28 items-center justify-center overflow-hidden">
				<img
					src={url}
					alt={filename}
					className="h-full w-full object-contain"
					draggable={false}
				/>
			</div>
			<div className="flex flex-col gap-1 p-2">
				<span className="truncate text-xs font-medium" title={filename}>
					{filename}
				</span>
				<span
					className="truncate font-mono text-[10px] opacity-50"
					title={path}
				>
					{path}
				</span>
				<div className="mt-1 flex gap-1">
					<button
						onClick={handleCopy}
						className="btn-mystia flex-1 rounded border border-black/10 px-2 py-0.5 text-[11px] hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
						title="复制路径"
					>
						复制路径
					</button>
					<button
						onClick={onRemove}
						className="btn-mystia-danger rounded px-2 py-0.5 text-[11px]"
					>
						删除
					</button>
				</div>
			</div>
		</div>
	);
});
