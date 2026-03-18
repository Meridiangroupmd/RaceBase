export const RACEBASE_ADDRESS = "0x855019F0674e4C370f9a50E316871f743D33c840" as const;

export const raceBaseAbi = [
  {
    type: "function",
    name: "checkIn",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "race",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "canCheckIn",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPlayer",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "checkIns", type: "uint256" },
      { name: "races", type: "uint256" },
      { name: "lastCheckIn", type: "uint256" },
      { name: "streak", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalCheckIns",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalRaces",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalPlayers",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CheckIn",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "streak", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Race",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "totalRaces", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
