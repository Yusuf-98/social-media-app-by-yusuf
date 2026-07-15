"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileSkeleton } from "@/components/profile/EditProfileSkeleton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { useMe, useUpdateMe } from "@/hooks/user/useMe";
import { ApiError } from "@/lib/api/client";
import { editProfileSchema, type EditProfileFormValues } from "@/lib/validators/profile";

export function EditProfileView() {
  const router = useRouter();
  const { data: me, isLoading, isError, refetch } = useMe();
  const updateMe = useUpdateMe();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    values: me
      ? { name: me.name, username: me.username, phone: me.phone ?? "", bio: me.bio ?? "" }
      : undefined,
  });

  if (isLoading) {
    return (
      <div>
        {/* Header - mobile */}
        <div className="h-7xl gap-md bg-base-black px-xl flex items-center border-b border-neutral-900 md:hidden">
          <ArrowIcon className="size-6 rotate-180" />
          <p className="text-md tracking-t-2 text-neutral-25 flex-1 font-bold">Edit Profile</p>
          <Skeleton className="size-10 shrink-0 rounded-full" />
        </div>

        <div className="custom-container mx-auto">
          <div className="gap-4xl pt-xl pb-3xl mx-auto flex w-full max-w-200 flex-col items-start md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
            <div className="gap-lg hidden items-center md:flex">
              <ArrowIcon className="size-8 rotate-180" />
              <p className="font-display text-display-xs text-neutral-25 font-bold">Edit Profile</p>
            </div>
            <EditProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }
  if (isError || !me) return <ErrorState onRetry={() => refetch()} />;

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : me.avatarUrl;

  function onSubmit(values: EditProfileFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("username", values.username);
    if (values.phone) formData.append("phone", values.phone);
    if (values.bio) formData.append("bio", values.bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    updateMe.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile success updated");
        router.push("/me");
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Failed to update profile");
      },
    });
  }

  return (
    <div>
      {/* Header - mobile */}
      <div className="h-7xl bg-base-black px-xl flex items-center justify-between border-b border-neutral-900 md:hidden">
        <div className="gap-md flex flex-1 items-center">
          <button type="button" onClick={() => router.back()} aria-label="Back">
            <ArrowIcon className="size-6 rotate-180" />
          </button>
          <p className="text-md tracking-t-2 text-neutral-25 flex-1 font-bold">Edit Profile</p>
        </div>
        <Avatar className="size-10">
          <AvatarImage src={me.avatarUrl ?? undefined} alt={me.name} />
          <AvatarFallback>{me.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      </div>

      <div className="custom-container mx-auto">
        <div className="gap-4xl pt-xl pb-3xl mx-auto flex w-full max-w-200 flex-col items-start md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
          {/* Header - desktop */}
          <div className="gap-lg hidden items-center md:flex">
            <button type="button" onClick={() => router.back()} aria-label="Back">
              <ArrowIcon className="size-8 rotate-180" />
            </button>
            <p className="font-display text-display-xs text-neutral-25 font-bold">Edit Profile</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="gap-xl md:gap-6xl flex w-full flex-col items-center md:flex-row md:items-start"
          >
            {/* Avatar */}
            <div className="gap-xl flex shrink-0 flex-col items-center">
              <UserAvatar src={avatarPreview} alt={me.name} className="size-20 md:size-32.5" />
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                className="md:h-6xl h-10 w-40"
              >
                Change Photo
              </Button>
            </div>

            {/* Fields */}
            <div className="gap-xl md:gap-3xl flex w-full flex-1 flex-col items-start">
              <InputField label="Name" error={errors.name?.message} {...register("name")} />
              <InputField
                label="Username"
                error={errors.username?.message}
                {...register("username")}
              />
              <div className="gap-xxs flex w-full flex-col items-start">
                <Label className="tracking-t-2 text-base-white text-sm font-bold">Email</Label>
                <Input value={me.email} readOnly />
              </div>
              <InputField
                label="Number Phone"
                type="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <div className="gap-xxs flex w-full flex-col items-start">
                <Label className="tracking-t-2 text-base-white text-sm font-bold">Bio</Label>
                <Textarea className="h-25.25 resize-none" {...register("bio")} />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={updateMe.isPending}
              >
                {updateMe.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
