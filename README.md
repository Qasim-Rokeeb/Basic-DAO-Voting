# Basic DAO Voting - Project #15

A decentralized autonomous organization (DAO) voting system where users can create proposals and vote on them. This project demonstrates basic governance mechanisms in a decentralized setting.

## 🚀 Features

- **Create Proposals**: Any user can submit proposals for voting
- **Democratic Voting**: Users can vote Yes or No on active proposals
- **Proposal Execution**: Successful proposals can be executed after voting period ends
- **Vote Tracking**: Prevents double voting and tracks participation
- **Time-based Governance**: Proposals have a set voting duration
- **Real-time Updates**: Live vote counts and proposal status
- **Responsive Design**: Works on all device sizes

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Blockchain**: Solidity, ethers.js
- **Network**: Base Sepolia Testnet
- **Wallet**: MetaMask integration

## 📋 Smart Contract Functions

### Core Functions
- `createProposal(string description)` - Create a new proposal
- `vote(uint256 proposalId, bool support)` - Vote on a proposal
- `executeProposal(uint256 proposalId)` - Execute a successful proposal
- `getProposal(uint256 proposalId)` - Get proposal details
- `getProposalCount()` - Get total number of proposals
- `hasVoted(uint256 proposalId, address voter)` - Check if user has voted

### View Functions
- Proposal details (description, votes, deadline, status)
- Vote tracking and participation
- Execution status

## 🔧 Smart Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BasicDAOVoting {
    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        address proposer;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public constant VOTING_DURATION = 7 days;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    function createProposal(string memory _description) external {
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.description = _description;
        proposal.deadline = block.timestamp + VOTING_DURATION;
        proposal.proposer = msg.sender;
        
        emit ProposalCreated(proposalId, msg.sender, _description);
    }
    
    function vote(uint256 _proposalId, bool _support) external {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support);
    }
    
    function executeProposal(uint256 _proposalId) external {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.yesVotes > proposal.noVotes, "Proposal failed");
        
        proposal.executed = true;
        
        // Add your execution logic here
        // For example: transfer funds, change contract state, etc.
        
        emit ProposalExecuted(_proposalId);
    }
    
    function getProposal(uint256 _proposalId) external view returns (
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 deadline,
        bool executed,
        address proposer
    ) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.deadline,
            proposal.executed,
            proposal.proposer
        );
    }
    
    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }
    
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        return proposals[_proposalId].hasVoted[_voter];
    }
}
```

## 🚀 Deployment Instructions

### 1. Smart Contract Deployment

```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Create Hardhat config for Base Sepolia
# hardhat.config.js
module.exports = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
  },
};

# Deploy contract
npx hardhat run scripts/deploy.js --network baseSepolia
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install react ethers

# Update contract address in the component
const DAO_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. Environment Setup

```bash
# Get Base Sepolia ETH from faucet
# Bridge from Ethereum Sepolia: https://bridge.base.org

# Add Base Sepolia to MetaMask:
# Network Name: Base Sepolia
# RPC URL: https://sepolia.base.org
# Chain ID: 84532
# Currency Symbol: ETH
# Block Explorer: https://sepolia.basescan.org
```

## 🎮 How to Use

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Create Proposal**: Write a description and submit a new proposal
3. **Vote on Proposals**: Vote "Yes" or "No" on active proposals
4. **Track Progress**: View real-time vote counts and proposal status
5. **Execute Proposals**: Execute successful proposals after voting ends

## 🔍 Project Structure

```
basic-dao-voting/
├── contracts/
│   ├── BasicDAOVoting.sol
│   └── deploy.js
├── src/
│   ├── BasicDAOVoting.jsx
│   └── index.js
└── README.md
```

## 🧪 Testing on Base Sepolia

1. **Get Test ETH**: Use Base Sepolia faucet or bridge from Ethereum Sepolia
2. **Deploy Contract**: Deploy using Hardhat to Base Sepolia
3. **Verify Contract**: Verify on BaseScan for transparency
4. **Test Functions**: Create proposals, vote, and execute

## 🔒 Security Features

- **Vote Prevention**: Users can only vote once per proposal
- **Time Limits**: Proposals have fixed voting periods
- **Execution Logic**: Only successful proposals can be executed
- **Access Control**: Proper permission checks
- **Event Logging**: All actions are logged for transparency

## 🎯 Learning Objectives

- Understand DAO governance mechanisms
- Learn proposal creation and voting systems
- Implement time-based contract logic
- Handle state management in voting systems
- Build democratic decision-making tools

## 🔄 Possible Enhancements

1. **Token-weighted Voting**: Vote power based on token holdings
2. **Delegation**: Allow users to delegate voting power
3. **Proposal Categories**: Different types of proposals
4. **Quorum Requirements**: Minimum participation thresholds
5. **Execution Delay**: Time delay before execution
6. **Proposal Deposits**: Require deposits to create proposals
7. **Vote Delegation**: Proxy voting capabilities
8. **Multi-choice Voting**: More than Yes/No options

## 📚 Key Concepts

- **Decentralized Governance**: Democratic decision making
- **Proposal Lifecycle**: Creation → Voting → Execution
- **Vote Tracking**: Preventing double voting
- **Time-based Logic**: Deadline management
- **Execution Logic**: Automated proposal implementation

## 🌐 Resources

- [Base Sepolia Faucet](https://bridge.base.org)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [OpenZeppelin Governance](https://docs.openzeppelin.com/contracts/4.x/governance)
- [DAO Best Practices](https://ethereum.org/en/dao/)

This project provides a foundation for understanding decentralized governance and can be extended to create more sophisticated DAO systems with features like token-weighted voting, delegation, and complex execution logic.