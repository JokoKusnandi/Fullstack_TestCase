import { ReactNode } from 'react';
import { FileText, Inbox, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateType = 'documents' | 'search' | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  className?: string;
}

const icons: Record<EmptyStateType, ReactNode> = {
  documents: <FileText className="h-12 w-12 text-muted-foreground/50" />,
  search: <Search className="h-12 w-12 text-muted-foreground/50" />,
  generic: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
};

const defaults: Record<EmptyStateType, { title: string; description: string }> = {
  documents: {
    title: 'No documents yet',
    description: 'Upload your first document to get started.',
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  generic: {
    title: 'Nothing here',
    description: 'There are no items to display.',
  },
};

export const EmptyState = ({
  type = 'generic',
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || icons[type]}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title || defaults[type].title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || defaults[type].description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="shadow-soft">
          {action.label}
        </Button>
      )}
    </div>
  );
};
