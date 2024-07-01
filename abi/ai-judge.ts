export const aiJudgeAbi = [
  {
    inputs: [
      {
        internalType: "contract IAIOracle",
        name: "_aiOracle",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "contract IAIOracle", name: "expected", type: "address" },
      { internalType: "contract IAIOracle", name: "found", type: "address" },
    ],
    name: "UnauthorizedCallbackSource",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "prompt",
        type: "string",
      },
    ],
    name: "promptRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "input", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "output",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "callbackData",
        type: "bytes",
      },
    ],
    name: "promptsUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "aiOracle",
    outputs: [
      { internalType: "contract IAIOracle", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "bytes", name: "output", type: "bytes" },
      { internalType: "bytes", name: "callbackData", type: "bytes" },
    ],
    name: "aiOracleCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "modelId", type: "uint256" },
      { internalType: "string", name: "prompt", type: "string" },
    ],
    name: "calculateAIResult",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "callbackGasLimit",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "modelId", type: "uint256" }],
    name: "estimateFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "modelId", type: "uint256" },
      { internalType: "string", name: "prompt", type: "string" },
    ],
    name: "getAIResult",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "isFinalized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "string", name: "", type: "string" },
    ],
    name: "prompts",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "requests",
    outputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "modelId", type: "uint256" },
      { internalType: "bytes", name: "input", type: "bytes" },
      { internalType: "bytes", name: "output", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "modelId", type: "uint256" },
      { internalType: "uint64", name: "gasLimit", type: "uint64" },
    ],
    name: "setCallbackGasLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
