type Answer = {
  id: number;
  created_at: string;
  userId: string;
  answer: string;
  roomId: string;
};

type Room = {
  id: number;
  created_at: string;
  question: string;
  winner: string;
  creator: string;
  users: string[];
  transactionId: string;
  invitations: string[];
  status: "pending" | "awaiting-results" | "complete";
};

type User = {
  id: number;
  created_at: string;
  userId: string;
  walletAddress: string;
};
