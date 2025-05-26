// utils/formatters.ts
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
  return formatted.substring(0, 23);
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
  }
  return cleaned;
};

export const formatPhone = (value: string): string => {
  return value.replace(/\D/g, "").substring(0, 15);
};

export const getCardType = (
  cardNumber: string
): "VISA" | "MASTERCARD" | "UNKNOWN" => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "VISA";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "MASTERCARD";
  return "UNKNOWN";
};
