/**
 * @param {number} number number to be formatted
 * @param {number} decimals decimals, default is 3 if not specified
 * @param {string} fallBackSymbol this sumbol is returned if input number is null or undefined
 * @returns {string} number formatted. Will round up if possible
 * @description render number with comma's and decimals. Use only to show values
 */
export const renderNumber = (
  number?: number | null,
  decimals?: number,
  fallBackSymbol?: string,
): string => {
  if (number !== 0 && !number) return fallBackSymbol || "";
  if (decimals !== undefined) {
    return number.toLocaleString("EN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return number?.toLocaleString("EN") || fallBackSymbol || "";
};

/**
 * @param {number} amount numberto be formatted
 * @param {number} decimals decimals, default is 3 if not specified
 * @param {string} fallBackSymbol this sumbol is returned if input number is null or undefined
 * @returns {string} amount formatted in USD. Will round up if possible
 * @description render USD with comma's and decimals. Use only to show values
 */
export const renderUsd = (
  amount?: number | null,
  decimals?: number,
  fallBackSymbol?: string,
): string => {
  if (amount !== 0 && !amount) return fallBackSymbol || "";
  if (decimals !== undefined) {
    return amount.toLocaleString("EN", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return amount.toLocaleString("EN", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * @param {number} percentage percentage to be formatted
 * @param {number} decimals decimals, default is 3 if not specified
 * @param {string} fallBackSymbol this sumbol is returned if input number is null or undefined
 * @returns {string} number formatted in percentage, includes percentage symbol. Will round up if possible
 * @description render percentage with comma's and decimals. Use only to show values
 */
export const renderPercentage = (
  percentage?: number | null,
  decimals = 2,
  fallBackSymbol?: string,
): string => {
  if (percentage !== 0 && !percentage) return fallBackSymbol || "";

  return `${percentage.toLocaleString("EN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
};

/**
 * @param {BigNumberish} num number to be formatted
 * @param {number} dec decimals, default is 2 if not specified
 * @returns {number} number formatted with specified decimals.
 * @description format without rounding up, for inputs.
 * @example formatToDecimals(1.2345, 3) -> 1.234
 */
export const formatToDecimals = (num: number, dec = 3): number => {
  return Math.trunc(num * Math.pow(10, dec)) / Math.pow(10, dec);
};
