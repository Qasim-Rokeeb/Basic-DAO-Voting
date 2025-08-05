// components/WalletConnection.jsx
import React from 'react';

export default function WalletConnection({ connectWallet }) {
  return (
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
  );
}
