import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import type { DocumentStatus } from "@/services/document.service";


// type DocumentStatus = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; icon: typeof Clock; className: string }> = {
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
    PENDING_DELETE: {
    label: 'Pending Delete',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  PENDING_REPLACE: {
    label: 'Pending Replace',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};
