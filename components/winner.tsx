import { getUser } from "@/app/_lib/get/get-user";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "./typography";
import Image from "next/image";
import nftPrize from "../public/prize/nft.png";
import Link from "next/link";
import { getWinningAnswer } from "@/app/_lib/get/get-winning-answer";

export const Winner = ({
  winnerUserId,
  roomId,
}: {
  winnerUserId: string;
  roomId: number;
}) => {
  const { data: winner, isLoading } = useQuery({
    queryKey: ["user", winnerUserId],
    queryFn: async () => await getUser(winnerUserId),
  });
  const { data: winningAnswer, isLoading: isLoadingAnswer } = useQuery({
    queryKey: ["answer", winnerUserId, roomId],
    queryFn: async () => await getWinningAnswer(winnerUserId, roomId),
  });

  if (isLoading || isLoadingAnswer) {
    return <></>;
  }

  return (
    <div className="align-baseline">
      <Typography variant="h2">Results are in!</Typography>
      <div className="h-6" />
      <Typography variant="body">
        The winner is <span className="font-bold">{winner?.email}</span>
      </Typography>
      <div className="h-2" />
      <Typography variant="body">
        The winning answer was "
        <span className="font-bold">{winningAnswer?.answer}</span>".
      </Typography>
      <div className="h-10" />
      <Typography variant="h3">Congratulations, you won an NFT!</Typography>
      <div className="h-2" />
      <div className="flex flex-col">
        <Image
          width="150"
          height="150"
          alt="winning-nft-prize"
          src={nftPrize}
        />
        <div className="h-4" />
        <Link
          className="text-primary underline-offset-4 hover:underline"
          target={"_blank"}
          href={`https://sepolia-optimism.etherscan.io/address/${winner?.walletAddress}#nfttransfers`}
        >
          Click here to view it{" "}
        </Link>
      </div>
    </div>
  );
};
