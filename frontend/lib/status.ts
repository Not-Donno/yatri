export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-400";
    case "ACCEPTED":
      return "text-blue-400";
    case "ON_THE_WAY":
      return "text-purple-400";
    case "ARRIVED":
      return "text-green-400";
    case "COMPLETED":
      return "text-gray-400";
    default:
      return "text-white";
  }
};