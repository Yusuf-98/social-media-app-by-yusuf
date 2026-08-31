"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { applyAuthToken } from "@/lib/auth-storage";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";
import { useAppDispatch } from "@/store/hooks";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      applyAuthToken(data.token, dispatch);
      queryClient.clear();
      router.replace(searchParams.get("returnTo") || "/feed");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Login failed");
    },
  });

  return (
    <div className="bg-base-black relative min-h-screen w-full overflow-clip">
      <AuthBackground />
      <div className="py-8xl relative z-10 flex min-h-screen items-center justify-center">
        {/* Card */}
        <div className="flex w-[clamp(345px,307.09px+9.647vw,446px)] flex-col items-center gap-[clamp(16px,13.00px+0.764vw,24px)] rounded-2xl border border-neutral-900 bg-black/20 px-[clamp(16px,13.00px+0.764vw,24px)] py-[clamp(32px,29.00px+0.764vw,40px)] backdrop-blur-[20px]">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2.75">
            <LogoIcon className="size-7.5" />
            <p className="font-display text-display-xs text-neutral-25 font-bold whitespace-nowrap">
              Sociality
            </p>
          </div>

          {/* Heading */}
          <p className="font-body text-neutral-25 md:font-display text-center text-[clamp(20px,18.50px+0.382vw,24px)] leading-[clamp(34px,33.25px+0.191vw,36px)] font-bold tracking-[clamp(-0.4px,-0.550px+0.0382vw,0px)] whitespace-nowrap">
            Welcome Back!
          </p>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="gap-2xl flex w-full flex-col items-start"
          >
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />
            <InputField
              label="Password"
              isPassword
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Actions */}
            <div className="gap-xl flex w-full flex-col items-center">
              <Button
                type="submit"
                variant="primary"
                className="h-[clamp(44px,42.50px+0.382vw,48px)] w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>

              {/* Register Container */}
              <div className="gap-xs flex items-center justify-center text-[clamp(14px,13.25px+0.191vw,16px)] leading-[clamp(28px,27.25px+0.191vw,30px)] whitespace-nowrap">
                <span className="tracking-t-2 text-neutral-25 font-semibold">
                  Don&apos;t have an account?
                </span>
                <Link
                  href="/register"
                  className="text-primary-200 font-bold tracking-[clamp(-0.32px,-0.0724px-0.0172vw,-0.14px)]"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
