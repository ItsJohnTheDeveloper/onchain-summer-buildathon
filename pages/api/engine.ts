import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import {
  isHex,
  http,
  createPublicClient,
  createWalletClient,
  formatEther,
  getContract,
  isAddress,
  Hash,
  decodeEventLog,
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { aiJudgeAbi } from "@/abi/ai-judge";
import { optimismSepolia } from "viem/chains";

// llama
const MODEL_ID = BigInt(11);

type Answer = {
  userId: string;
  roomId: number;
  answer: string;
};

type Room = {
  id: number;
  question: string;
  creator: string;
  winner?: string;
  transactionId?: string;
  participants?: string[];
  status: string;
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Starting judgement engine cron run");

  console.log("Fetching rooms that require submission to the judge");
  const judgmentRequired = await getRoomsRequiringJudgment(supabase);
  const judgePromises = judgmentRequired.map((room) =>
    submitForJudgement(supabase, room)
  );
  console.log(`Submitting ${judgmentRequired.length} rooms for judgement!`);
  await Promise.allSettled(judgePromises);

  for (const room of judgmentRequired) {
    await submitForJudgement(supabase, room);
  }

  console.log("Fetching rooms that require polling submission result");
  const txPollingRequired = await getRoomsRequiringPolling(supabase);
  const pollPromises = txPollingRequired.map((room) =>
    checkJudgementStatus(supabase, room)
  );

  console.log(`Polling judgement status on ${txPollingRequired.length} rooms`);
  await Promise.allSettled(pollPromises);

  console.log("Finishing judgement engine cron run");

  return res.status(200).json({
    message: `submitted ${judgmentRequired.length} rooms for judgement and polled ${txPollingRequired.length} different judgements`,
  });
}

async function getRoomsRequiringJudgment(
  supabase: SupabaseClient
): Promise<{ room: Room; answers: Answer[] }[]> {
  const { data: rooms } = (await supabase
    .from("room")
    .select()
    .eq("status", "awaiting-results")
    .eq("transactionId", "")
    .eq("winner", "")) as {
    data: Room[];
  };
  if (rooms == null) {
    return [];
  }

  const roomsWithAnswers = [];
  for (const room of rooms) {
    const { data: answers } = (await supabase
      .from("answer")
      .select()
      .eq("roomId", room.id)) as { data: Answer[] };

    if (answers == null) {
      console.log(`Room ${room.id} does not have any answers, skipping`);
      continue;
    }

    console.log("Here's the answers");
    console.log(answers);

    if (room.participants == null) {
      throw new Error("Room has nobody in it, incorrect state");
    }

    roomsWithAnswers.push({ room, answers });
  }

  return roomsWithAnswers;
}

async function submitForJudgement(
  supabase: SupabaseClient,
  {
    room,
    answers,
  }: {
    room: Room;
    answers: Answer[];
  }
) {
  if (room.participants == null) {
    throw new Error("Invalid state, participants null");
  }

  if (answers.length < 2) {
    throw new Error(
      "To receive judgement, a room must have at least two answers"
    );
  }

  if (typeof process.env.RPC !== "string") {
    throw new Error("'env.RPC' not configured correctly");
  }

  const transport = http(process.env.RPC);

  if (typeof env.PRIVATE_KEY !== "string" || !isHex(env.PRIVATE_KEY)) {
    throw new Error("Check env, 'PRIVATE_KEY' is invalid");
  }

  const publicClient = createPublicClient({ transport });
  const submissionWallet = createWalletClient({
    account: privateKeyToAccount(env.PRIVATE_KEY),
    transport,
  });

  const aiJudgeAddress = process.env.AI_CONTRACT_ADDRESS;
  if (aiJudgeAddress == null || !isAddress(aiJudgeAddress)) {
    throw new Error(
      "env misconfigured, please add 'AI_CONTRACT_ADDRESS' and make sure it's a valid address"
    );
  }

  const aiJudgeContract = getContract({
    address: aiJudgeAddress,
    abi: aiJudgeAbi,
    client: submissionWallet,
  });

  const fee = await aiJudgeContract.read.estimateFee([MODEL_ID]);

  const balance = await publicClient.getBalance({
    address: submissionWallet.account.address,
  });

  if (balance < fee) {
    throw new Error(
      `Balance on submission wallet is too low at ${formatEther(
        balance
      )} ether to pay the fee at ${formatEther(fee)}`
    );
  }

  console.log("Simulating the call");

  console.log("Sending transaction");
  const hash = await aiJudgeContract.write.calculateAIResult(
    [MODEL_ID, constructAIPrompt({ room, answers })],
    {
      value: fee,
      chain: optimismSepolia,
      nonce: await publicClient.getTransactionCount({
        address: submissionWallet.account.address,
        blockTag: "latest",
      }),
    }
  );
  console.log(`Sent transaction: hash ${hash}`);

  console.log(`Upating the room transactionId to be ${hash}`);
  await updateRoomTransactionId(supabase, room.id, hash);
}

async function checkJudgementStatus(supabase: SupabaseClient, room: Room) {
  if (typeof process.env.RPC !== "string") {
    throw new Error("'env.RPC' not configured correctly");
  }

  const transport = http(process.env.RPC);

  if (typeof env.PRIVATE_KEY !== "string" || !isHex(env.PRIVATE_KEY)) {
    throw new Error("Check env, 'PRIVATE_KEY' is invalid");
  }

  const publicClient = createPublicClient({ transport });

  const aiJudgeAddress = process.env.AI_CONTRACT_ADDRESS;
  if (aiJudgeAddress == null || !isAddress(aiJudgeAddress)) {
    throw new Error(
      "env misconfigured, please add 'AI_CONTRACT_ADDRESS' and make sure it's a valid address"
    );
  }

  const aiJudgeContract = getContract({
    address: aiJudgeAddress,
    abi: aiJudgeAbi,
    client: publicClient,
  });

  // TODO, do this non-sync, for hackathon it's fine.
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: room.transactionId as Hash,
  });

  // Iterate over the logs and decode them
  const log = receipt.logs[1];
  const decoded = decodeEventLog({
    abi: aiJudgeAbi,
    data: log.data,
    topics: log.topics,
  }) as {
    eventName: "promptRequest";
    args: { modelId: bigint; prompt: string };
  };
  console.log(decoded);

  // AI responds with winning userId
  const winningUser = await aiJudgeContract.read.prompts([
    decoded.args.modelId,
    decoded.args.prompt,
  ]);

  // In the case the answer is not ready;
  if (!winningUser) {
    console.log("Judge has not ruled yet, returning");
    return;
  }

  console.log(`Game winner is ${winningUser}`);
  await updateRoomWinner(supabase, room.id, winningUser);

  // fetch winning user data
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("userId", winningUser)
    .single();

  if (error) {
    console.error("Error fetching user data", error);
    throw error;
  }

  const user: User | null = data;
  // mint nft to the winning user's wallet

  console.log("Minting NFT for winner");
  await mintNFT(user?.walletAddress!, "Winner of a challenge", room);
}

function constructAIPrompt({
  room,
  answers,
}: {
  room: Room;
  answers: Answer[];
}) {
  const instructions =
    "Given a question and a list of answers, each associated with a user, respond ONLY with the id of the user you think has the best or most correct answer to the question\n";
  const question = `Question: ${room.question}\n`;
  let prompt = instructions + question;

  for (const { userId, answer } of answers) {
    prompt += `User ${userId}: ${answer}`;
  }

  return prompt;
}

async function updateRoomTransactionId(
  supabase: SupabaseClient,
  roomId: number,
  transactionId: string
) {
  const { data, error } = await supabase
    .from("room")
    .update({ transactionId })
    .eq("id", roomId);

  if (error) {
    console.error("Error updating transactionId:", error);
    throw error;
  }

  return data;
}

async function updateRoomWinner(
  supabase: SupabaseClient,
  roomId: number,
  winner: string
) {
  const { data, error } = await supabase
    .from("room")
    .update({ winner, status: "complete" })
    .eq("id", roomId);

  if (error) {
    console.error("Error updating transactionId:", error);
    throw error;
  }

  return data;
}

async function getRoomsRequiringPolling(
  supabase: SupabaseClient
): Promise<Room[]> {
  const { data: rooms, error } = await supabase
    .from("room")
    .select()
    .neq("transactionId", "")
    .eq("winner", "");

  if (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }

  return rooms as Room[];
}

async function mintNFT(walletAddress: string, name: string, room: Room) {
  const options = {
    method: "PUT",
    headers: {
      "X-API-KEY": process.env.CROSSMINT_SERVER_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: `optimism-sepolia:${walletAddress}`,
      metadata: {
        name: name,
        image:
          "https://img.pixers.pics/pho_wat(s3:700/FO/35/23/40/84/700_FO35234084_e52d78d4e1d6f15a006343eb2545966a.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/wall-murals-trophy-cup.jpg.jpg",
        description:
          "NFT to represent winning a challenge and being selected by the judge.",
      },
      reuploadLinkedFiles: true,
      compressed: true,
    }),
  };

  const response = await fetch(
    `https://staging.crossmint.com/api/2022-06-09/collections/${process.env
      .CROSSMINT_COLLECTION_ID!}/nfts/${room.id}`,
    options
  );
  console.log({ status: response.status });
  if (!response.ok) {
    console.log({
      json: await response.json(),
      message: "Something went wrong minting the NFT.",
    });
    throw new Error("Failed to mint NFT");
  }
  const result = await response.json();
  console.log({ result });
  return result;
}
