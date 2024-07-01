import { getUser } from "@/app/_lib/get/get-user";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "./typography";
import Image from "next/image";
import nftPrize from "../public/prize/nft.png";
import Link from "next/link";

export const Winner = ({ winnerUserId }: { winnerUserId: string }) => {
  const { data: winner, isLoading } = useQuery({
    queryKey: ["answers", winnerUserId],
    queryFn: async () => await getUser(winnerUserId),
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="align-baseline">
      <Typography variant="h4">
        Results are in! Winner: {winner?.email}
      </Typography>
      <div className="h-10" />
      <Typography variant="h2">Congratulations, you won an NFT!</Typography>
      <div className="h-10" />
      <div className="flex items-center flex-col">
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
