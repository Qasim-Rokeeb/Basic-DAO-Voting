// utils.js

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isProposalActive = (deadline, executed) => {
  return new Date() < deadline && !executed;
};

export const getProposalStatus = (proposal) => {
  if (proposal.executed) return "Executed";
  if (new Date() > proposal.deadline) return "Expired";
  return "Active";
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Active": return "text-green-600 bg-green-100";
    case "Executed": return "text-blue-600 bg-blue-100";
    case "Expired": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
};
