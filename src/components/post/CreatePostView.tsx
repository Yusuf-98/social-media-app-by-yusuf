"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowIcon } from "@/components/icons";
import { PhotoDropzone } from "@/components/post/PhotoDropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCreatePost } from "@/hooks/post/useCreatePost";
import { ApiError } from "@/lib/api/client";
import { createPostSchema, type CreatePostFormValues } from "@/lib/validators/post";

interface CreatePostViewProps {
  variant?: "page" | "modal";
}

export function CreatePostView({ variant = "page" }: CreatePostViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createPost = useCreatePost();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({ resolver: zodResolver(createPostSchema) });

  function onSubmit(values: CreatePostFormValues) {
    const formData = new FormData();
    formData.append("image", values.image);
    if (values.caption.trim()) formData.append("caption", values.caption.trim());

    createPost.mutate(formData, {
      onSuccess: () => {
        toast.success("Post shared successfully");
        router.push("/feed");
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Failed to create post");
      },
    });
  }

  const isModal = variant === "modal";

  return (
    <div>
      {/* Header - mobile */}
      {!isModal && (
        <div className="h-7xl gap-md bg-base-black px-xl flex items-center justify-between border-b border-neutral-900 md:hidden">
          <div className="gap-md flex flex-1 items-center">
            <button type="button" onClick={() => router.back()} aria-label="Back">
              <ArrowIcon className="size-6 rotate-180" />
            </button>
            <p className="text-md tracking-t-2 text-neutral-25 flex-1 font-bold">Add Post</p>
          </div>
          <Avatar className="size-10">
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={isModal ? "mx-auto" : "custom-container mx-auto"}>
        <div className="gap-3xl pt-xl pb-3xl mx-auto flex w-full max-w-113 flex-col items-start md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
          {/* Header - desktop */}
          {!isModal && (
            <div className="gap-lg hidden items-center md:flex">
              <button type="button" onClick={() => router.back()} aria-label="Back">
                <ArrowIcon className="size-8 rotate-180" />
              </button>
              <p className="font-display text-display-xs text-neutral-25 font-bold">Add Post</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="gap-xl flex w-full flex-col items-end"
          >
            <div className="gap-xxs flex w-full flex-col items-start">
              <p className="tracking-t-2 text-neutral-25 w-full text-sm font-bold">Photo</p>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <PhotoDropzone
                    file={field.value ?? null}
                    onFileChange={field.onChange}
                    error={errors.image?.message}
                  />
                )}
              />
            </div>

            <div className="gap-xxs flex w-full flex-col items-start">
              <p className="tracking-t-2 text-neutral-25 w-full text-sm font-bold">Caption</p>
              <Textarea
                {...register("caption")}
                placeholder="Create your caption"
                className="placeholder:text-md min-h-25.25 resize-none text-sm"
                aria-invalid={!!errors.caption}
              />
              {errors.caption && (
                <p className="tracking-t-3 text-alert-danger w-full text-sm font-[510]">
                  {errors.caption.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? "Sharing..." : "Share"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
