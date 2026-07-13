type Props = {
  error: string;
  onRetry: () => void;
};

export default function ErrorBanner({ error, onRetry }: Props) {
  return (
    <div className="mb-4 rounded-lg border border-red-800 bg-red-500/10 p-4">
      <p className="text-sm text-red-400">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-red-400 underline hover:text-red-300"
      >
        Try again
      </button>
    </div>
  );
}
