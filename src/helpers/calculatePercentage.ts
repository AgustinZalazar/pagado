export const changePercentage = (currentTotal: number, previousTotal: number) => {
    if (previousTotal === 0) {
        return "0%";
    }

    const percentageChange = ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100;
    return `${percentageChange.toFixed(2)}%`;
};