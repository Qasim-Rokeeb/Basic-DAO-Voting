// components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Basic DAO Voting
      </h1>
      <p className="text-gray-600">
        Create proposals and participate in decentralized governance
      </p>
    </div>
  );
}