import { getUser } from "@/app/_lib/get/get-user";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "./typography";

export const Winner = ({ winnerUserId }: { winnerUserId: string }) => {
  const { data: winner, isLoading } = useQuery({
    queryKey: ["answers", winnerUserId],
    queryFn: async () => await getUser(winnerUserId),
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <Typography variant="h4">
      Results are in! Winner: {winner?.email}
    </Typography>
  );
};
