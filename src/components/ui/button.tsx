import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button-variants";

import { cn } from "@/lib/utils";

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
