'use client';

import {
	useIdRangeValidation,
	ID_RANGE_STATUS_LABEL,
} from '@/components/common/useIdRangeValidation';
import { ErrorBadge } from '@/components/common/ErrorBadge';

interface IdRangeBadgeProps {
	id: number;
}

export function IdRangeBadge({ id }: IdRangeBadgeProps) {
	const status = useIdRangeValidation(id);

	if (!status || status === 'valid') return null;

	if (status === 'unmanaged') {
		return (
			<span className="rounded bg-warning px-1.5 py-0.5 text-[10px] font-medium text-white">
				{ID_RANGE_STATUS_LABEL[status]}
			</span>
		);
	}

	return <ErrorBadge>{ID_RANGE_STATUS_LABEL[status]}</ErrorBadge>;
}
