import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-6xl px-xl py-md text-md tracking-t-2 text-neutral-25 focus-visible:ring-primary-200/50 aria-invalid:border-alert-danger w-full min-w-0 rounded-xl border border-neutral-900 bg-neutral-950 transition-colors outline-none placeholder:text-neutral-600 focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-950 aria-invalid:bg-neutral-950",
        className
      )}
      {...props}
    />
  );
}

export { Input };
