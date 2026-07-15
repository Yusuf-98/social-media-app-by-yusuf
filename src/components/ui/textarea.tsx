import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "px-xl py-md text-md text-neutral-25 focus-visible:ring-primary-200/50 aria-invalid:border-alert-danger flex field-sizing-content min-h-16 w-full rounded-xl border border-neutral-900 bg-neutral-950 transition-colors outline-none placeholder:text-neutral-600 focus-visible:ring-2 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-950 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
