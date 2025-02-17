const formatter = new Intl.NumberFormat("en-AU", {
	style: "currency",
	currency: "AUD",
});

/**
 *
 * @param price - Price number in cents
 * @returns Formatted price. Eg, 150 -> $1.50
 */
export const formatToCurrency = (price: number) =>
	formatter.format(price / 100);
