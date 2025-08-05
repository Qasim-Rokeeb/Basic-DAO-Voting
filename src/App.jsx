import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import WalletConnection from './components/WalletConnection';
import AccountInfo from './components/AccountInfo';
import CreateProposal from './components/CreateProposal';
import ProposalList from './components/ProposalList';
import ErrorMessage from './components/ErrorMessage';
import { formatAddress, getProposalStatus, isProposalActive } from './utils';

import { DAO_ABI, DAO_ADDRESS } from './constants';

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const loadProposals = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.getProposalCount();
      const data = [];
      for (let i = 0; i < count; i++) {
        const proposal = await contract.getProposal(i);
        const hasVoted = await contract.hasVoted(i, account);
        data.push({
          id: i,
          description: proposal[0],
          yesVotes: proposal[1].toString(),
          noVotes: proposal[2].toString(),
          deadline: new Date(Number(proposal[3]) * 1000),
          executed: proposal[4],
          proposer: proposal[5],
          hasVoted
        });
      }
      setProposals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async () => {
    if (!contract || !newProposal.trim()) return;
    try {
      setLoading(true);
      const tx = await contract.createProposal(newProposal);
      await tx.wait();
      setNewProposal("");
      await loadProposals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (proposalId, support) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.vote(proposalId, support);
      await tx.wait();
      await loadProposals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = async (proposalId) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
      await loadProposals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      loadProposals();
    }
  }, [contract, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        {!account ? (
          <WalletConnection connectWallet={connectWallet} />
        ) : (
          <>
            <AccountInfo account={account} loading={loading} onRefresh={loadProposals} />
            <CreateProposal
              newProposal={newProposal}
              setNewProposal={setNewProposal}
              onSubmit={createProposal}
              loading={loading}
            />
            <ProposalList
              proposals={proposals}
              loading={loading}
              vote={vote}
              executeProposal={executeProposal}
              account={account}
            />
            {error && <ErrorMessage error={error} />}
          </>
        )}
      </div>
    </div>
  );
}
