import { ChartOptions, ChartData } from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { getLastYearMonths } from "../../utils/getLastYearMonths";
import { BarElement, ArcElement, PointElement, LineElement, Filler } from "chart.js";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
	Filler
);

// BAR CHART FOR SHOWING 1 OR 2 DATA
// =================================

interface BarChartProps {
	data_1: number[];
	title_1: string;
	heading?: string;
	position?: "top" | "bottom" | "left" | "right";
	data_2?: number[];
	title_2?: string;
	bgColor_1?: string;
	bgColor_2?: string;
	labels?: string[];
	isBgLines?: boolean;
	horizontal?: boolean;
	horizontalWidth?: number;
	isTittleAppear?: boolean;
	barThickness?: number;
	barWidth?: string | number;
}
export const BarChartComponent = ({
	heading,
	position,
	title_1,
	title_2,
	data_1,
	data_2,
	bgColor_1 = "#35A2EB",
	bgColor_2 = "#FF6384",
	isTittleAppear = false,
	horizontal = false,
	horizontalWidth = 20,
	barWidth,
	isBgLines = false,
	barThickness = 0.8,
	labels = getLastYearMonths().slice(-7),
}: BarChartProps) => {
	const options: ChartOptions<"bar"> = {
		responsive: true,
		indexAxis: horizontal ? "y" : "x",
		plugins: {
			legend: {
				display: isTittleAppear,
				position: horizontal ? "left" : "bottom",
				maxHeight: 20,
				maxWidth: horizontalWidth,
			},
			title: {
				fullSize: true,
				text: heading,
				display: heading ? true : false,
				font: { size: 20, weight: 300 },
				position: position ? position : "top",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					display: isBgLines,
				},
			},
			x: {
				grid: {
					display: isBgLines,
				},
			},
		},
	};
	const data: ChartData<"bar", number[], string> = {
		labels,
		datasets: [
			{
				label: title_1,
				data: data_1,
				backgroundColor: bgColor_1,
				barThickness: "flex",
				barPercentage: 1,
				categoryPercentage: barThickness,
			},
			{
				label: title_2 ? title_2 : "Data_2",
				data: data_2 ? data_2 : [],
				hidden: data_2 ? false : true,
				backgroundColor: bgColor_2,
				barThickness: "flex",
				barPercentage: 1,
				categoryPercentage: barThickness,
			},
		],
	};
	return <Bar width={barWidth} options={options} data={data} />;
};

// DOUGHNUT CHART FOR SHOWING DATA
// ===============================
interface DoughnutChartProps {
	labels: string[];
	data: number[];
	bgColor?: string[];
	cutout?: number | string;
	legends?: boolean;
	offset?: number[];
}
export const DoughnutChartComponent = ({
	data = [20, 80],
	labels = [],
	bgColor = ["#35A2EB", "#FF6384"],
	legends = true,
	offset = [],
	cutout,
}: DoughnutChartProps) => {
	const options: ChartOptions<"doughnut"> = {
		responsive: true,
		plugins: {
			legend: {
				display: legends,
				position: "bottom",
				maxWidth: 10,
				labels: {
					padding: 30,
					boxPadding: 2,
				},
			},
		},
		cutout,
	};
	const doughnutData: ChartData<"doughnut", number[], string> = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: bgColor,
				borderWidth: 0,
				offset,
			},
		],
	};
	return <Doughnut options={options} data={doughnutData} />;
};

// pie CHART FOR SHOWING DATA
// ==========================
interface PieChartProps {
	labels: string[];
	data: number[];
	bgColor?: string[];
	offset?: number[];
}
export const PieChartComponent = ({
	data = [20, 80],
	labels = [],
	bgColor = ["#35A2EB", "#FF6384"],
	offset = [],
}: PieChartProps) => {
	const options: ChartOptions<"pie"> = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
	};
	const pieData: ChartData<"pie", number[], string> = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: bgColor,
				borderWidth: 1,
				offset,
			},
		],
	};
	return <Pie options={options} data={pieData} />;
};

// LINE CHART FOR SHOWING 1 DATA
// =============================
interface LineChartProps {
	data: number[];
	title: string;
	bgColor?: string;
	borderColor?: string;
	labels?: string[];
	isBgLines?: boolean;
	isTittleAppear?: boolean;
	heading?: string;
	position?: "top" | "bottom" | "left" | "right";
}
export const LineChartComponent = ({
	heading,
	position,
	title,
	data,
	bgColor = "#35A2EB",
	borderColor = "#FF6384",
	isTittleAppear = false,
	isBgLines = false,
	labels = getLastYearMonths(),
}: LineChartProps) => {
	const lineChartOption: ChartOptions<"line"> = {
		responsive: true,
		plugins: {
			legend: {
				display: isTittleAppear,
				maxHeight: 20,
			},
			title: {
				fullSize: true,
				text: heading,
				display: heading ? true : false,
				font: { size: 20, weight: 300 },
				position: position ? position : "top",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					display: isBgLines,
				},
			},
			x: {
				grid: {
					display: isBgLines,
				},
			},
		},
	};
	const lineChartData: ChartData<"line", number[], string> = {
		labels,
		datasets: [
			{
				label: title,
				data,
				fill: true,
				backgroundColor: bgColor,
				borderColor,
			},
		],
	};
	return <Line options={lineChartOption} data={lineChartData} />;
};
