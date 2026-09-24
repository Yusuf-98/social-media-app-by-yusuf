"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { LogoIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { register as registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { applyAuthToken } from "@/lib/auth-storage";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth";
import { useAppDispatch } from "@/store/hooks";

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) => {
      const { confirmPassword: _confirmPassword, ...payload } = values;
      return registerUser(payload);
    },
    onSuccess: (data) => {
      applyAuthToken(data.token, dispatch);
      queryClient.clear();
      router.replace("/feed");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Registration failed");
    },
  });

  return (
    <main className="bg-base-black relative min-h-screen w-full overflow-clip">
      <AuthBackground />
      <div className="py-8xl relative z-10 flex min-h-screen items-center justify-center">
        {/* Card */}
        <div className="flex w-[clamp(345px,278.19px+17.001vw,523px)] flex-col items-center gap-[clamp(16px,13.00px+0.764vw,24px)] rounded-2xl border border-neutral-900 bg-black/20 px-[clamp(16px,13.00px+0.764vw,24px)] py-[clamp(32px,29.00px+0.764vw,40px)] backdrop-blur-[50px]">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2.75">
            <LogoIcon className="size-7.5" />
            <p className="font-display text-display-xs text-neutral-25 font-bold whitespace-nowrap">
              Sociality
            </p>
          </div>

          {/* Heading */}
          <p className="font-display text-display-xs text-neutral-25 text-center font-bold whitespace-nowrap">
            Register
          </p>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="gap-2xl flex w-full flex-col items-start"
          >
            <InputField
              label="Name"
              placeholder="Enter your name"
              error={errors.name?.message}
              {...register("name")}
            />
            <InputField
              label="Username"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register("username")}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
            />
            <InputField
              label="Number Phone"
              type="tel"
              placeholder="Enter your number phone"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <InputField
              label="Password"
              isPassword
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <InputField
              label="Confirm Password"
              isPassword
              placeholder="Enter your confirm password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Actions */}
            <div className="gap-xl flex w-full flex-col items-center">
              <Button
                type="submit"
                variant="primary"
                className="h-[clamp(44px,42.50px+0.382vw,48px)] w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>

              {/* Register Container */}
              <div className="gap-xs flex items-center justify-center text-[clamp(14px,13.25px+0.191vw,16px)] leading-[clamp(28px,27.25px+0.191vw,30px)] whitespace-nowrap">
                <span className="tracking-t-2 text-neutral-25 font-semibold">
                  Already have an account?
                </span>
                <Link
                  href="/login"
                  className="text-primary-200 font-bold tracking-[clamp(-0.32px,-0.0724px-0.0172vw,-0.14px)]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
