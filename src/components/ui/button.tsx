import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-md rounded-full p-md h-5xl md:h-6xl font-bold text-sm md:text-md tracking-t-1 md:tracking-t-2 whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary-200/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary-300 text-neutral-25",
        secondary: "border border-neutral-900 text-neutral-25",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

function Button({
  className,
  variant,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      render={render}
      nativeButton={render ? false : undefined}
      {...props}
    />
  );
}

export { Button, buttonVariants };
