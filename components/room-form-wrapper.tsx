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
import { UpdateRoomData, updateRoom } from "@/app/_lib/update/update-room";
import { Winner } from "./winner";
import { Check, Hourglass } from "./icons";
import { Skeleton } from "./skeleton";

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

  const { data: room, isInitialLoading: isInitialLoadingRoom } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => await getRoom(roomId),
    refetchInterval: 5000,
  });
  const { data: user, isInitialLoading: isInitialLoadingUser } = useQuery({
    queryKey: ["user", session?.user_id],
    queryFn: async () => {
      if (session) {
        return await getUser(session.user_id);
      }
    },
    refetchInterval: 5000,
  });

  const { data: allAnswers, isInitialLoading: isInitialLoadingAnswers } =
    useQuery({
      queryKey: ["answers", roomId],
      queryFn: async () => await getAnswersByRoom(roomId),
      initialData: [],
      refetchInterval: 5000,
    });

  const myAnswer = allAnswers.find((answer) => answer.userId === user?.userId);
  const participantUserIds = allAnswers.map((answer) => answer.userId);

  const { data: participantUsers } = useQuery({
    initialData: [],
    queryKey: ["participantUsers", participantUserIds],
    queryFn: async () => {
      return await Promise.all(
        participantUserIds.map(async (userId) => {
          const user = await getUser(userId);
          const answer = allAnswers.find((a) => a.userId === userId);
          return { user, hasAnswered: !!answer };
        })
      );
    },
    refetchInterval: 5000,
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

  console.log({ room, participantUsers, participantUserIds });

  const roomMutation = useMutation({
    mutationKey: ["room", roomId],
    mutationFn: updateRoom,
    onSuccess: async () => {
      // invalidate cache
      await queryClient.setQueryData(["room", roomId], (oldData: any) => {
        return { ...oldData, status: "awaiting-results" };
      });
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

  if (isInitialLoadingRoom || isInitialLoadingUser || isInitialLoadingAnswers) {
    return (
      <div className="container flex flex-col p-8">
        <Skeleton className="h-4 w-40" />
        <div className="h-4" />
        <Skeleton className="h-10 w-full max-w-6xl" />
      </div>
    );
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
    const mutateData: UpdateRoomData = {
      roomId: room.id,
      status: "awaiting-results",
    };
    // update the status of the room
    await roomMutation.mutateAsync(mutateData);
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
        {participants.map((email) => {
          const participant = participantUsers.find(
            (participant) => participant.user?.email === email
          );
          return (
            <div key={email} className="flex items-center">
              <Typography variant="body">{email}</Typography>
              {participant?.hasAnswered ? (
                <Check className="h-5 mx-2 text-primary" />
              ) : (
                <Hourglass className="h-5 mx-2 text-[#af7f0e]" />
              )}
            </div>
          );
        })}

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
            variant="secondary"
            onClick={onSubmitAnswer}
            className="mt-5"
          >
            Add answer
          </Button>
        ) : null}
        <div className="h-16" />

        {isRoomCreator && room.status === "pending" ? (
          <>
            <Typography variant="h3">Submit to AI:</Typography>
            <div className="h-6" />
            {!canSubmitRoom ? (
              <Typography variant="body" className="text-destructive">
                You must have at least 1 more participant submit an answer
                before submitting to AI.
              </Typography>
            ) : null}
            <div className="h-6" />

            <Button
              type="button"
              disabled={!canSubmitRoom}
              onClick={handleOnSubmitRoom}
            >
              Submit
            </Button>
          </>
        ) : null}

        {room.status === "awaiting-results" ? (
          <Typography variant="h4">Results are being calculated...</Typography>
        ) : null}

        {room.status === "complete" ? (
          <Winner winnerUserId={room.winner} />
        ) : null}
      </form>
    </div>
  );
}
