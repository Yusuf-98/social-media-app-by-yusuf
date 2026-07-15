interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="gap-lg py-11xl flex flex-col items-center justify-center text-center">
      <p className="text-accent-red text-lg font-medium">{title}</p>
      {description && <p className="text-md text-neutral-400">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-xl py-sm text-md text-neutral-25 rounded-lg border border-neutral-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
