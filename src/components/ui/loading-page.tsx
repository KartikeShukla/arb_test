import { LoadingSpinner } from "./loading-spinner";

export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}
