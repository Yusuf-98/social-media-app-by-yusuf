"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-base-black flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-neutral-25 text-lg font-medium">Something went wrong</p>
        <button
          type="button"
          onClick={reset}
          className="text-neutral-25 rounded-lg border border-neutral-700 px-5 py-2 text-sm"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
