export const contractAddress = "0x140Da0eB56a0e0703e74f6DbF26d5343Eb47Ce9b";
export const contractABI = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        inputs: [{ internalType: "string", name: "_name", type: "string" }],
        name: "addProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_name", type: "string" }],
        name: "findProposalByName",
        outputs: [{ internalType: "int256", name: "", type: "int256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getChairPerson",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLengthProposals",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getProposals",
        outputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    {
                        internalType: "uint256",
                        name: "votesCount",
                        type: "uint256",
                    },
                ],
                internalType: "struct Vote.Proposal[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "getVotesByID",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "proposals",
        outputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "uint256", name: "votesCount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_name", type: "string" }],
        name: "removeProposalByName",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "removeVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint32", name: "index", type: "uint32" }],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "voters",
        outputs: [
            { internalType: "bool", name: "voted", type: "bool" },
            { internalType: "uint256", name: "vote", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "votersList",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
];
