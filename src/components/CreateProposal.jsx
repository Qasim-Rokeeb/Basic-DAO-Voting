// components/CreateProposal.jsx
import React from 'react';

export default function CreateProposal({ newProposal, setNewProposal, onSubmit, loading }) {
  return (
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
          onClick={onSubmit}
          disabled={loading || !newProposal.trim()}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Proposal"}
        </button>
      </div>
    </div>
  );
}
