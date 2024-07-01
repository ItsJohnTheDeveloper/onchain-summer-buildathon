type Answer = {
  created_at: string;
  userId: string;
  answer: string;
  roomId: number;
};

type Room = {
  id: number;
  created_at: string;
  question: string;
  winner: string;
  creator: string;
  users: string[];
  transactionId: string;
  participants: string[];
  status: "pending" | "awaiting-results" | "complete";
};

type User = {
  id: number;
  created_at: string;
  userId: string;
  walletAddress: string;
  email: string;
};
