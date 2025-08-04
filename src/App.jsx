import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Smart Contract ABI
const DAO_ABI = [
  "function createProposal(string memory description) external",
  "function vote(uint256 proposalId, bool support) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) external view returns (string memory description, uint256 yesVotes, uint256 noVotes, uint256 deadline, bool executed, address proposer)",
  "function getProposalCount() external view returns (uint256)",
  "function hasVoted(uint256 proposalId, address voter) external view returns (bool)",
  "function VOTING_DURATION() external view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support)",
  "event ProposalExecuted(uint256 indexed proposalId)"
];

// Replace with your deployed contract address
const DAO_ADDRESS = "0x1234567890123456789012345678901234567890";

export default function BasicDAOVoting() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Connect to wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(accounts[0]);
        setError("");
      } else {
        setError("Please install MetaMask!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Load all proposals
  const loadProposals = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const proposalCount = await contract.getProposalCount();
      const proposalsData = [];

      for (let i = 0; i < proposalCount; i++) {
        const proposal = await contract.getProposal(i);
        const hasVoted = await contract.hasVoted(i, account);
        
        proposalsData.push({
          id: i,
          description: proposal[0],
          yesVotes: proposal[1].toString(),
          noVotes: proposal[2].toString(),
          deadline: new Date(Number(proposal[3]) * 1000),
          executed: proposal[4],
          proposer: proposal[5],
          hasVoted: hasVoted
        });
      }

      setProposals(proposalsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new proposal
  const createProposal = async () => {
    if (!contract || !newProposal.trim()) return;

    try {
      setLoading(true);
      const tx = await contract.createProposal(newProposal);
      await tx.wait();
      
      setNewProposal("");
      await loadProposals();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Vote on proposal
  const vote = async (proposalId, support) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.vote(proposalId, support);
      await tx.wait();
      
      await loadProposals();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Execute proposal
  const executeProposal = async (proposalId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
      
      await loadProposals();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load proposals when contract is available
  useEffect(() => {
    if (contract && account) {
      loadProposals();
    }
  }, [contract, account]);

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if proposal is active
  const isProposalActive = (deadline, executed) => {
    return new Date() < deadline && !executed;
  };

  // Get proposal status
  const getProposalStatus = (proposal) => {
    if (proposal.executed) return "Executed";
    if (new Date() > proposal.deadline) return "Expired";
    return "Active";
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-100";
      case "Executed": return "text-blue-600 bg-blue-100";
      case "Expired": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Basic DAO Voting
          </h1>
          <p className="text-gray-600">
            Create proposals and participate in decentralized governance
          </p>
        </div>

        {/* Wallet Connection */}
        {!account ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600">
                Connect your wallet to participate in DAO governance
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Connected Account</p>
                    <p className="font-mono text-sm">{formatAddress(account)}</p>
                  </div>
                </div>
                <button
                  onClick={loadProposals}
                  disabled={loading}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Create Proposal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create New Proposal
              </h2>
              <div className="space-y-4">
                <textarea
                  value={newProposal}
                  onChange={(e) => setNewProposal(e.target.value)}
                  placeholder="Describe your proposal..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={createProposal}
                  disabled={loading || !newProposal.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Proposal"}
                </button>
              </div>
            </div>

            {/* Proposals List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Proposals ({proposals.length})
              </h2>
              
              {proposals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No proposals yet</p>
                  <p className="text-sm text-gray-400">Create the first proposal to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => {
                    const status = getProposalStatus(proposal);
                    const totalVotes = parseInt(proposal.yesVotes) + parseInt(proposal.noVotes);
                    const yesPercentage = totalVotes > 0 ? (parseInt(proposal.yesVotes) / totalVotes * 100) : 0;
                    
                    return (
                      <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                Proposal #{proposal.id}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {status}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-2">{proposal.description}</p>
                            <p className="text-xs text-gray-500">
                              By {formatAddress(proposal.proposer)} • 
                              Ends {proposal.deadline.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Vote Results */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Yes: {proposal.yesVotes}</span>
                            <span>No: {proposal.noVotes}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${yesPercentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {yesPercentage.toFixed(1)}% approval ({totalVotes} total votes)
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {isProposalActive(proposal.deadline, proposal.executed) && !proposal.hasVoted && (
                            <>
                              <button
                                onClick={() => vote(proposal.id, true)}
                                disabled={loading}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                              >
                                Vote Yes
                              </button>
                              <button
                                onClick={() => vote(proposal.id, false)}
                                disabled={loading}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                Vote No
                              </button>
                            </>
                          )}
                          
                          {proposal.hasVoted && (
                            <span className="text-sm text-gray-500 px-4 py-2">
                              ✓ You have voted
                            </span>
                          )}
                          
                          {status === "Expired" && !proposal.executed && parseInt(proposal.yesVotes) > parseInt(proposal.noVotes) && (
                            <button
                              onClick={() => executeProposal(proposal.id)}
                              disabled={loading}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              Execute
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}