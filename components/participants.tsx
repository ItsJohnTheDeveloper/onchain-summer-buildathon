import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type UpdateRoomData, updateRoom } from "@/app/_lib/update/update-room";
import { getUserByEmail } from "@/app/_lib/get/get-user-by-email";

export const Participants = ({ room }: { room: Room }) => {
  const [newEmail, setNewEmail] = useState("");

  const queryClient = useQueryClient();

  const roomMutation = useMutation({
    mutationKey: ["room", room.id],
    mutationFn: updateRoom,
    onSuccess: async (data) => {
      // invalidate cache
      await queryClient.setQueryData(["room", room.id], data);
      setNewEmail("");
    },
  });

  const sendInvitation = async () => {
    try {
      const email = newEmail.trim();

      // Send email invitation to user if they don't exist in db, otherwise add them to room.
      const participantUser = await getUserByEmail(email);
      if (!participantUser) {
        const response = await fetch("/api/invite", {
          method: "POST",
          body: JSON.stringify({ roomId: room.id, email }),
        });
        if (!response.ok) {
          throw new Error(`Failed to invite ${email} to the room`);
        }
      }

      const mutatedData: UpdateRoomData = {
        roomId: room.id,
        participants: [email],
      };
      if (room.participants) {
        mutatedData.participants = [...room.participants, email];
      }

      await roomMutation.mutateAsync(mutatedData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-4 flex justify-between">
      <Input
        className="border p-2 mr-2"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="Add a new participant"
      />
      <Button
        type="button"
        onClick={sendInvitation}
        variant="secondary"
        className="rounded-full text-2xl p-3"
      >
        +
      </Button>
    </div>
  );
};
