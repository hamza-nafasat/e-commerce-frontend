import toast from "react-hot-toast";
import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import AdminAside from "../../components/admin/AdminAside";
import { BarChartComponent, DoughnutChartComponent } from "../../components/admin/Charts";
import DashboardTable from "../../components/admin/DashboardTable";
import { useDashboardStatsQuery } from "../../redux/api/adminApi";
import { StoreRootState } from "../../redux/store/store";
import { CustomErrorType } from "../../types/api-types";
import { DashboardStats } from "../../types/types";
import { getColor } from "../../utils/getColorsForPercentage";

const Dashboard = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);

    const { data, isLoading, isError, error } = useDashboardStatsQuery(user?._id!);
    // error handling for dashboard
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    const stats: DashboardStats = data?.data!;
    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading || isError ? (
                <Loader />
            ) : (
                <main className="dashboard">
                    {/* === SEARCH BAR ARTICLE === */}
                    {/* ========================== */}
                    <article className="searchContainer">
                        <BsSearch />
                        <input
                            type="text"
                            id="adminSearch"
                            name="adminSearch"
                            placeholder="Search users and docs"
                        />
                        <FaRegBell />
                        <img src={user?.photo} alt="user dp" />
                    </article>
                    {/* == WIDGETS BOXES ARTICLE == */}
                    {/* =========================== */}
                    <article className="widgetContainer">
                        <WidgetItem
                            heading={"Revenue"}
                            value={stats.totalCounts.revenue}
                            percent={stats.thisToLastMonthPercentage.revenue}
                            amount={true}
                            getColor={getColor}
                        />
                        <WidgetItem
                            heading={"Transaction"}
                            getColor={getColor}
                            value={stats.totalCounts.orders}
                            percent={stats.thisToLastMonthPercentage.orders}
                        />
                        <WidgetItem
                            heading={"Products"}
                            value={stats.totalCounts.products}
                            percent={stats.thisToLastMonthPercentage.products}
                            getColor={getColor}
                        />
                        <WidgetItem
                            heading={"Users"}
                            value={stats.totalCounts.users}
                            percent={stats.thisToLastMonthPercentage.users}
                            getColor={getColor}
                        />
                    </article>
                    {/* ====== GRAPH ARTICLE ====== */}
                    {/* =========================== */}
                    <article className="graphAndInventoryContainer">
                        <section className="revenueChart">
                            <h2>Revenue & Transaction</h2>
                            <BarChartComponent
                                title_1="Revenue"
                                title_2="Transactions"
                                data_1={stats?.TransactionAndRevenueChartData?.totalRevenueData}
                                data_2={stats?.TransactionAndRevenueChartData?.transactionCountData}
                                bgColor_1="rgb(0,115,255)"
                                bgColor_2="rgba(52,162,253,0.7)"
                                barThickness={0.5}
                                isTittleAppear
                            />
                        </section>
                        <section className="inventoryDetails">
                            <h2>InventOry</h2>
                            {Object.entries(stats.inventoryProductsCategoryPercentage).map(
                                ([category, percentage]) => {
                                    return (
                                        <InventoryItem
                                            key={category}
                                            heading={category}
                                            value={percentage}
                                            getColor={getColor}
                                        />
                                    );
                                }
                            )}
                        </section>
                    </article>
                    {/* TRANSACTION & GENDER ARTICLE */}
                    {/* ============================ */}
                    <article className="transactionAndGenderChartContainer">
                        <section className="genderChart">
                            <h2>Gender Ratio</h2>
                            <DoughnutChartComponent
                                data={Object.values(stats.userChartData)}
                                labels={["Female", "Male"]}
                                cutout={"60%"}
                                bgColor={["hsl(340,82%,56%)", "rgba(53,162,235,0.8)"]}
                            />
                            <p>
                                <BiMaleFemale />
                            </p>
                        </section>
                        <section className="transactionTable">
                            <DashboardTable tableData={stats.latestTransactionsData} />
                        </section>
                    </article>
                </main>
            )}
        </div>
    );
};

export default Dashboard;

// COMPONENT FOR ITEMS IN WIDGET CONTAINER
// ========================================
interface WidgetItemProps {
    heading: string;
    value: number;
    percent: number;
    getColor: (percent: number) => string;
    amount?: boolean;
}
const WidgetItem = ({ heading, value, percent, getColor, amount = false }: WidgetItemProps) => {
    const color = getColor(percent);

    return (
        <section className="widgetItem">
            <section className="widgetInfo">
                <p>{heading}</p>
                <h4>{amount ? `$${value}` : value}</h4>
                {percent > 0 ? (
                    <span style={{ color: color }}>
                        <HiTrendingUp /> +{percent}%
                    </span>
                ) : (
                    <span style={{ color: color }}>
                        <HiTrendingDown /> {percent}%
                    </span>
                )}
            </section>
            <section
                className="widgetCircleBar"
                style={{
                    background: `conic-gradient(${color} ${
                        (Math.abs(percent) / 100) * 360
                    }deg,rgba(255,255,255) 0)`,
                }}
            >
                <span style={{ color: color }}>{Math.abs(Math.round(percent))}%</span>
            </section>
        </section>
    );
};

// COMPONENT FOR ITEMS IN INVENTORY CONTAINER
// ==========================================
interface InventoryItemProps {
    heading: string;
    value: number;
    getColor: (value: number) => string;
}
const InventoryItem = ({ heading, value, getColor }: InventoryItemProps) => {
    const color = getColor(value);
    return (
        <section className="inventoryItem">
            <header>
                <h5>{heading}</h5>
            </header>
            <div className="inventoryBar">
                <div style={{ backgroundColor: color, width: `${value}%` }} />
            </div>
            <span>{value}%</span>
        </section>
    );
};
