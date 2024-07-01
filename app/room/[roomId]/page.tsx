import RoomFormWrapper from "@/components/room-form-wrapper";

export default function ActiveRoom({ params }: { params: { roomId: string } }) {
  const roomId = Number(params.roomId || 0);
  return <RoomFormWrapper roomId={roomId} />;
}
