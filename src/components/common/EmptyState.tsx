interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="gap-lg py-11xl flex w-full flex-col items-center justify-center text-center">
      {icon}
      <p className="text-neutral-25 text-lg font-medium">{title}</p>
      {description && <p className="text-md text-neutral-400">{description}</p>}
      {action}
    </div>
  );
}
