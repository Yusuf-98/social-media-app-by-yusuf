"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/icons";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-neutral-950/80 duration-100",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className="gap-md data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 md:gap-xl md:data-open:zoom-in-95 md:data-closed:zoom-out-95 fixed inset-x-0 bottom-0 z-50 flex w-full flex-col items-end duration-100 outline-none md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-fit md:max-w-[calc(100%-2rem)] md:-translate-x-1/2 md:-translate-y-1/2"
        {...props}
      >
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" className="max-md:px-xl shrink-0">
            <CloseIcon className="size-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
        <div
          className={cn(
            "gap-lg px-xl pt-xl pb-4xl text-neutral-25 md:gap-2xl md:p-2xl flex w-full flex-col items-start rounded-t-2xl border border-neutral-900 bg-neutral-950 text-sm md:rounded-2xl",
            className
          )}
        >
          {children}
        </div>
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn("gap-md flex flex-col", className)} {...props} />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-2xl -mb-2xl gap-md p-xl flex flex-col-reverse rounded-b-2xl border-t border-neutral-800 bg-neutral-800/50 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="secondary" />}>Close</DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-md tracking-t-2 text-neutral-25 font-bold md:text-xl", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "*:[a]:hover:text-neutral-25 text-sm text-neutral-400 *:[a]:underline *:[a]:underline-offset-3",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
