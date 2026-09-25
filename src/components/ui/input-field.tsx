"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface InputFieldProps extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  error?: string;
  isPassword?: boolean;
  id?: string;
}

function InputField({ label, error, isPassword, className, id, type, ...props }: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="gap-xxs flex w-full flex-col items-start">
      <Label htmlFor={inputId} className="tracking-t-2 text-base-white text-sm font-bold">
        {label}
      </Label>
      <div className="relative w-full">
        <Input
          id={inputId}
          type={isPassword ? (visible ? "text" : "password") : type}
          aria-invalid={!!error}
          className={cn(isPassword && "pr-6xl", className)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3.5 flex size-6 -translate-y-1/2 items-center justify-center"
          >
            {visible ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
          </button>
        )}
      </div>
      {error && <p className="tracking-t-3 text-alert-danger text-sm font-medium">{error}</p>}
    </div>
  );
}

export { InputField };
