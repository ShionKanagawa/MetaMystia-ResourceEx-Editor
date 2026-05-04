/**
 * 站内公告。
 *
 * 当 {@link ANNOUNCEMENT_VERSION} 变更时，所有用户在下一次访问时会自动看到一次
 * 公告弹窗（关闭后写入 localStorage，相同版本不再重复弹出）。
 *
 * 维护方式：
 * - 仅在确实需要让所有用户重新看到公告时才更新版本字符串。
 * - 版本字符串建议附带日期，便于回溯，例如 `v0.9.0-2026-05-04`。
 * - 节段顺序即展示顺序；建议把"最重要的事"放在第一项。
 */

export const ANNOUNCEMENT_VERSION = 'v0.9.0-2026-05-04';

export const ANNOUNCEMENT_TITLE = 'MetaMystia ResourceEx Editor 公告';

export interface AnnouncementSection {
	/** 节段标题。 */
	title: string;
	/** 该节段下的条目，纯文本，自上而下展示。 */
	items: string[];
}

export const ANNOUNCEMENT_SECTIONS: AnnouncementSection[] = [
	{
		title: '重构通知',
		items: [
			'MetaMiku 最近全面重构了此编辑器，使用时请多导出，如果您发现有任何 bug，请及时反馈。',
		],
	},
];
