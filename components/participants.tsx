import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateRoomData, updateRoom } from "@/app/_lib/update/update-room";

export const Participants = ({ room }: { room: Room }) => {
  const [items, setItems] = useState<{ locked: boolean; text: string }[]>([]);
  const [newItem, setNewItem] = useState("");

  const queryClient = useQueryClient();

  const roomMutation = useMutation({
    mutationKey: ["room", room.id],
    mutationFn: updateRoom,
    onSuccess: async () => {
      // invalidate cache
      await queryClient.invalidateQueries(["room", room.id] as any);
    },
  });

  const addItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, { text: newItem, locked: false }]);
      setNewItem("");
    }
  };

  const sendInvitation = async (index: number) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, locked: true } : item))
    );

    try {
      // TODO validate text is valid email.
      const email = items[index].text;

      console.log(`Inviting email ${email} to the room`);
      const response = await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({ roomId: room.id, email }),
      });

      if (!response.ok) {
        throw new Error(`Failed to invite ${email} to the room`);
      }
      console.log(`Successfully invited ${email} to the room`);
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
    <div className="py-4">
      <div className="mb-4">
        <Input
          className="border p-2 mr-2"
          label="Add a new participant"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Participant's email address"
        />
        <Button
          type="button"
          onClick={addItem}
          variant="ghost"
          className="mt-1"
        >
          Add
        </Button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between mb-2">
            <span className={item.locked ? "line-through" : ""}>
              {item.text}
            </span>
            <div>
              {!item.locked && (
                <Button
                  onClick={() => sendInvitation(index)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 mr-2 rounded"
                >
                  Invite
                </Button>
              )}
              {/* {!item.locked && (
                <Button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Remove
                </Button>
              )} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
