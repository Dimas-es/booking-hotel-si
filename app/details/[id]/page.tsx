import RoomDetails from "@/components/room-details/RoomDetails";

export default function RoomDetailsPage({ params }: { params: { id: string } }) {
  return <RoomDetails roomId={params.id} />;
}