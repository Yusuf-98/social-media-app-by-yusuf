"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TrashIcon, UploadArrowIcon, UploadCloudIcon } from "@/components/icons";

interface PhotoDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export function PhotoDropzone({ file, onFileChange, error }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFileChange(dropped);
  }

  const borderColorClass = error
    ? "text-alert-danger"
    : isDragging
      ? "text-primary-200"
      : "text-neutral-900";

  return (
    <div className="gap-sm flex w-full flex-col items-start">
      <div
        className={`gap-lg px-3xl py-xl relative flex w-full flex-col items-center rounded-xl bg-neutral-950 ${borderColorClass}`}
      >
        <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="11.5"
            ry="11.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            shapeRendering="crispEdges"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {previewUrl ? (
          <>
            <div className="relative aspect-square w-full shrink-0 md:aspect-auto md:size-98.75">
              <Image src={previewUrl} alt="" fill unoptimized className="object-contain" />
            </div>
            <div className="gap-lg flex items-start">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="gap-sm px-lg flex h-10 items-center rounded-lg border border-neutral-900 bg-neutral-900"
              >
                <UploadArrowIcon className="size-5" />
                <span className="tracking-t-3 text-neutral-25 text-sm font-[510]">
                  Change Image
                </span>
              </button>
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="gap-sm px-lg flex h-10 items-center rounded-lg border border-neutral-900 bg-neutral-900"
              >
                <TrashIcon className="size-5" />
                <span className="tracking-t-3 text-alert-danger text-sm font-[510]">
                  Delete Image
                </span>
              </button>
            </div>
            <p
              aria-hidden="true"
              className="tracking-t-3 w-full text-center text-sm font-[510] text-neutral-950"
            >
              PNG or JPG{"  "}(max. 5mb)
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="gap-lg flex w-full flex-col items-center"
          >
            <div className="flex size-10 items-center justify-center rounded-md border border-neutral-900">
              <UploadCloudIcon className="size-5" />
            </div>
            <div className="gap-xs flex w-full flex-col items-center">
              <div className="gap-xs flex items-start justify-center">
                <span className="tracking-t-2 text-primary-200 text-sm font-bold">
                  Click to upload
                </span>
                <span className="tracking-t-2 text-sm font-semibold text-neutral-600">
                  or drag and drop
                </span>
              </div>
              <p className="tracking-t-2 w-full text-center text-sm font-semibold text-neutral-600">
                PNG or JPG{"  "}(max. 5mb)
              </p>
            </div>
          </button>
        )}
      </div>
      {error && <p className="tracking-t-3 text-alert-danger w-full text-sm font-[510]">{error}</p>}
    </div>
  );
}
