// After deploying with Foundry, paste the deployed address here
export const COUNTER_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const counterAbi = [
  {
    type: "function",
    name: "number",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "increment",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setNumber",
    inputs: [{ name: "newNumber", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
