"use client";

import { type PostRoomData, postRoom } from "@/app/_lib/post/post-room";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Typography } from "@/components/typography";
import { useStytchSession } from "@stytch/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  question: string;
};

export default function CreateRoom() {
  const router = useRouter();
  const { session } = useStytchSession();
  const { control, handleSubmit } = useForm<FormValues>();

  const mutation = useMutation({
    mutationKey: ["room"],
    mutationFn: postRoom,
  });

  const onSubmit = async (data: FormValues) => {
    const sessionEmail =
      // @ts-expect-error - session type is wrong
      session?.authentication_factors?.[0]?.email_factor?.email_address ?? "";
    try {
      const mutateData: PostRoomData = {
        question: data.question,
        creator: session?.user_id ?? "",
        participants: [sessionEmail],
      };
      const room = await mutation.mutateAsync(mutateData);
      router.push(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container max-w-lg py-16">
      <Typography variant="h1">Create Room</Typography>
      <div className="h-8" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="question"
          render={({ field }) => (
            <Input {...field} label="Please enter your question" />
          )}
        />
        <Button type="submit" className="mt-8">
          Create Room
        </Button>
      </form>
    </div>
  );
}
