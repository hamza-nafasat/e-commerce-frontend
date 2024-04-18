// FUNCTION FOR GETTING LAST 12 MONTH DYNAMICALLY
// ==============================================
export const getLastYearMonths = (): string[] => {
	const months: string[] = [];
	const data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const currentMonth = new Date().getMonth();
	const remains = 11 - currentMonth;
	for (let i = currentMonth; i >= 0; i--) {
		months.unshift(data[i]);
	}
	for (let i = remains; i > 0; i--) {
		months.unshift(data[currentMonth + i]);
	}
	return months;
};
