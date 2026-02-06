export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
        return "₹0.00";
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0, // Usually rounded for furniture, but can optionally be 2
    }).format(amount);
};
