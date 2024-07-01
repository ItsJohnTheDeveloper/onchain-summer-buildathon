"use client";

import { getRoom } from "@/app/_lib/get/get-room";
import { getUser } from "@/app/_lib/get/get-user";
import { useStytchSession } from "@stytch/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Error from "next/error";
import { Controller, useForm } from "react-hook-form";
import { Typography } from "./typography";
import { Participants } from "./participants";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { getAnswersByRoom } from "@/app/_lib/get/get-answers-by-room";
import { PostAnswerData, postAnswer } from "@/app/_lib/post/post-answer";
import { useEffect } from "react";
import { getRoomAnswerByUserId } from "@/app/_lib/get/get-room-answer-by-user-id";

type FormValues = {
  users: string[];
  answer: string;
};

export default function RoomFormWrapper({ roomId }: { roomId: number }) {
  const { control, watch, setValue } = useForm<FormValues>();
  const { session } = useStytchSession();
  const queryClient = useQueryClient();

  const sessionEmail =
    // @ts-expect-error - session type is wrong
    session?.authentication_factors?.[0]?.email_factor?.email_address ?? "";

  const { data: room, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => await getRoom(roomId),
  });
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", session?.user_id],
    queryFn: async () => {
      if (session) {
        return await getUser(session.user_id);
      }
    },
  });

  const { data: allAnswers, isLoading: isLoadingAnswers } = useQuery({
    queryKey: ["answers", roomId],
    queryFn: async () => await getAnswersByRoom(roomId),
    initialData: [],
  });
  const { data: myAnswer, isLoading: isLoadingMyAnswer } = useQuery({
    queryKey: ["answer", room?.id, user?.userId],
    queryFn: async () => {
      if (room?.id && user?.userId) {
        return await getRoomAnswerByUserId(String(room.id), user.userId);
      }
    },
  });
  const answerMutation = useMutation({
    mutationKey: ["answer"],
    mutationFn: postAnswer,
    onSuccess: async () => {
      // invalidate cache
      await queryClient.invalidateQueries([
        "answer",
        room?.id,
        user?.userId,
      ] as any);
    },
  });

  const isRoomCreator = room?.creator === user?.userId;
  const canSubmitRoom = allAnswers.length > 1 && isRoomCreator;
  const participants = room?.participants ?? [];

  useEffect(() => {
    if (myAnswer) {
      setValue("answer", myAnswer.answer);
    }
  }, [roomId, myAnswer]);

  const isLoading =
    isLoadingRoom || isLoadingUser || isLoadingAnswers || isLoadingMyAnswer;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!room || (!isRoomCreator && !participants.includes(sessionEmail))) {
    return (
      <Error
        statusCode={404}
        title="Room not found and/or you don't have access to room, please go back to home page"
      />
    );
  }

  const onSubmitAnswer = async () => {
    const watchedAnswer = watch("answer");
    // userId: string;
    // answer: string;
    // roomId: string;
    const data: PostAnswerData = {
      userId: user?.userId!,
      answer: watchedAnswer,
      roomId: room.id,
    };
    await answerMutation.mutateAsync(data);
  };

  const handleOnSubmitRoom = async () => {
    console.log("submitting room");
    // todo
  };

  return (
    <div className="container py-8">
      <form>
        <Typography variant="tag">Room: {room.id}</Typography>
        <div className="h-1" />
        <Typography variant="h1">{room.question}</Typography>

        <div className="h-12" />
        <Typography variant="h3">Participants:</Typography>

        {isRoomCreator ? <Participants room={room} /> : null}

        <div className="h-4" />
        {participants.map((participant) => (
          <div key={participant} className="flex items-center">
            <Typography variant="body">{participant}</Typography>
          </div>
        ))}

        <div className="h-8" />
        <Typography variant="h3">My Answer:</Typography>
        <div className="h-6" />
        <Controller
          control={control}
          name="answer"
          render={({ field }) => (
            <Textarea
              disabled={!!myAnswer}
              placeholder="Add an answer to the question above"
              {...field}
            />
          )}
        />
        {!myAnswer ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onSubmitAnswer}
            className="mt-1"
          >
            Add answer
          </Button>
        ) : null}
        <div className="h-16" />

        {isRoomCreator ? (
          <>
            <Typography variant="h3">Submit to AI:</Typography>
            <div className="h-6" />
            {!canSubmitRoom ? (
              <Typography variant="body" className="text-destructive">
                You must have at least 1 more participant submit an answer
                before submitting to AI.
              </Typography>
            ) : null}

            <Button
              variant="ghost"
              disabled={!canSubmitRoom}
              onClick={handleOnSubmitRoom}
            >
              Submit
            </Button>
          </>
        ) : null}
      </form>
    </div>
  );
}
