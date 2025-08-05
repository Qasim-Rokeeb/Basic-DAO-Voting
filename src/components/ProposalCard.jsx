// components/ProposalCard.jsx
import React from 'react';
import { formatAddress, getProposalStatus, getStatusColor, isProposalActive } from '../utils';

export default function ProposalCard({ proposal, vote, executeProposal, loading }) {
  const status = getProposalStatus(proposal);
  const totalVotes = parseInt(proposal.yesVotes) + parseInt(proposal.noVotes);
  const yesPercentage = totalVotes > 0 ? (parseInt(proposal.yesVotes) / totalVotes * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
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
            By {formatAddress(proposal.proposer)} • Ends {proposal.deadline.toLocaleDateString()}
          </p>
        </div>
      </div>

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
}
