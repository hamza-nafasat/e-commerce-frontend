// FUNCTION FOR GETTING COLORS ACCORDING TO PERCENTAGE
export const getColor = (percent: number): string => {
    if (percent < 0) {
        return "#FF0000";
    } else if (percent === 0) {
        return "#FF0000";
    } else if (percent <= 10) {
        return "#87D068";
    } else if (percent <= 20) {
        return "#55C57A";
    } else if (percent <= 30) {
        return "#29B6F6";
    } else if (percent <= 40) {
        return "#42A5F5";
    } else if (percent <= 50) {
        return "#667EEA";
    } else if (percent <= 60) {
        return "#9C27B0";
    } else if (percent <= 70) {
        return "#F59E0B";
    } else if (percent <= 80) {
        return "#F9A825";
    } else if (percent <= 90) {
        return "#FABB50";
    } else {
        return "lime";
    }
};
