import RoomFormWrapper from "@/components/room-form-wrapper";

export default function ActiveRoom({ params }: { params: { roomId: string } }) {
  return <RoomFormWrapper roomId={Number(params.roomId || 0)} />;
}
