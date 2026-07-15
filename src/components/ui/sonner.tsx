"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CloseIcon } from "@/components/icons";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group font-body! top-5! right-4! left-auto! max-sm:w-auto! md:top-20! md:right-24!"
      position="top-right"
      closeButton
      icons={{
        close: <CloseIcon className="size-4" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex h-5xl items-center justify-between gap-md rounded-md px-lg py-md w-88.25! max-sm:left-auto! max-sm:right-0! max-sm:w-[min(353px,calc(100vw-32px))]! md:w-[clamp(291px,423.86px-9.23vw,353px)]!",
          icon: "hidden",
          title: "flex-1 text-sm font-semibold tracking-t-2 text-base-white",
          closeButton:
            "static! order-last! m-0! size-4! shrink-0 border-0! bg-transparent! p-0! text-inherit! hover:bg-transparent!",
          success: "bg-accent-green",
          error: "bg-alert-danger",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
