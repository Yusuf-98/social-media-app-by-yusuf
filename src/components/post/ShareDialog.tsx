"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  EmailIcon,
  FacebookIcon,
  LinkedInIcon,
  LinkIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShareDialogProps {
  path: string;
  children: React.ReactNode;
}

export function ShareDialog({ path, children }: ShareDialogProps) {
  const [open, setOpen] = useState(false);

  function getUrl() {
    return `${window.location.origin}${path}`;
  }

  function handleCopy() {
    navigator.clipboard
      .writeText(getUrl())
      .then(() => {
        toast.success("Link copied to clipboard");
        setOpen(false);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  }

  const options = [
    {
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(getUrl())}`, "_blank"),
    },
    {
      label: "Facebook",
      Icon: FacebookIcon,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
          "_blank"
        ),
    },
    {
      label: "X",
      Icon: XIcon,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}`,
          "_blank"
        ),
    },
    {
      label: "LinkedIn",
      Icon: LinkedInIcon,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
          "_blank"
        ),
    },
    {
      label: "Telegram",
      Icon: TelegramIcon,
      onClick: () =>
        window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}`, "_blank"),
    },
    {
      label: "Email",
      Icon: EmailIcon,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent("Check this out")}&body=${encodeURIComponent(getUrl())}`;
      },
    },
    {
      label: "Copy Link",
      Icon: LinkIcon,
      onClick: handleCopy,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>
      <DialogContent className="min-h-100 md:w-137 md:max-w-137">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <div className="gap-lg grid w-full grid-cols-5">
          {options.map(({ label, Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="gap-sm flex flex-col items-center"
            >
              <span className="flex size-12 items-center justify-center rounded-full border border-neutral-900 bg-neutral-950">
                <Icon className="size-6" />
              </span>
              <span className="tracking-t-2 text-xs text-neutral-400">{label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
