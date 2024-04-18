import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AdminAside from "../../../components/admin/AdminAside";
import { DoughnutChartComponent, PieChartComponent } from "../../../components/admin/Charts";
import { usePieChartStateQuery } from "../../../redux/api/adminApi";
import { StoreRootState } from "../../../redux/store/store";
import { CustomErrorType } from "../../../types/api-types";

const PieCharts = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);

    const { data, isLoading, isError, error } = usePieChartStateQuery(user?._id!);
    // error handling for pie Chart
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    const chartData = data?.data!;

    const adminCustomerRatio = chartData?.adminCustomerRatio;
    const orderFulfillment = chartData?.orderFulfillment;
    const productsCategoriesRatio = chartData?.productsCategoriesRatio;
    const revenueDistribution = chartData?.revenueDistribution;
    const stockAvailability = chartData?.stockAvailability;
    const usersAgeRatio = chartData?.usersAgeRatio;

    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading || isError ? (
                <Loader />
            ) : (
                <main className="PieChartsContainer">
                    <h2>Doughnut & Pie Charts</h2>
                    {/*  PIE CHART  */}
                    {/* =========== */}
                    <section>
                        {/* 1 */}
                        {orderFulfillment ? (
                            <article>
                                <PieChartComponent
                                    data={[
                                        orderFulfillment.processing,
                                        orderFulfillment.shipped,
                                        orderFulfillment.delivered,
                                    ]}
                                    offset={[0, 0, 50]}
                                    labels={["Processing", "Shipped", "Delivered"]}
                                    bgColor={[`hsl(110,80%,80%)`, `hsl(110,80%,50%)`, `hsl(110,40%,50%)`]}
                                />
                                <h3>Order fulfillment ratio</h3>
                            </article>
                        ) : null}
                        {/* 2 */}
                        {usersAgeRatio ? (
                            <article>
                                <PieChartComponent
                                    offset={[0, 0, 50]}
                                    data={[usersAgeRatio.teen, usersAgeRatio.adult, usersAgeRatio.old]}
                                    bgColor={[`hsl(10,80%,80%)`, `hsl(10,80%,50%)`, `hsl(10,40%,50%)`]}
                                    labels={[
                                        "Teenager (below - 20)",
                                        "Adult (20 - 40)",
                                        "Older (above - 40)",
                                    ]}
                                />
                                <h3>User age group</h3>
                            </article>
                        ) : null}
                    </section>
                    {/*  DOUGHNUT CHART  */}
                    {/* ================ */}
                    <section>
                        {/* 1 */}
                        {revenueDistribution ? (
                            <article>
                                <DoughnutChartComponent
                                    legends={false}
                                    labels={[
                                        "Net Margin",
                                        "Burnt",
                                        "Discount",
                                        "Production Cost",
                                        "Total Earning",
                                    ]}
                                    data={[
                                        revenueDistribution.netMargin,
                                        revenueDistribution.burnt,
                                        revenueDistribution.discount,
                                        revenueDistribution.productionCost,
                                        revenueDistribution.totalEarning,
                                    ]}
                                    bgColor={[
                                        "hsl(110,80%,40%)",
                                        "hsl(19,80%,40%)",
                                        "hsl(69,80%,40%)",
                                        "hsl(300,80%,40%)",
                                        "rgb(53,162,255)",
                                    ]}
                                    offset={[23, 30, 20, 30, 80]}
                                />
                                <h3>Revenue distribution</h3>
                            </article>
                        ) : null}
                        {/* 2 */}
                        {productsCategoriesRatio ? (
                            <article>
                                <DoughnutChartComponent
                                    legends={false}
                                    offset={[0, 0, 0, 80]}
                                    labels={Object.entries(productsCategoriesRatio).map(([category]) => {
                                        return category;
                                    })}
                                    data={Object.entries(productsCategoriesRatio).map(([, ratio]) => {
                                        return ratio;
                                    })}
                                    bgColor={[35, 56, 90].map((item) => `hsl(${item * 4},${item}%,50%)`)}
                                />
                                <h3>Product categories ratio</h3>
                            </article>
                        ) : null}
                        {/* 3 */}
                        {stockAvailability ? (
                            <article>
                                <DoughnutChartComponent
                                    cutout={"70%"}
                                    legends={false}
                                    data={[stockAvailability.inStock, stockAvailability.outOfStock]}
                                    offset={[0, 80]}
                                    labels={["In Stock", "Out Stock"]}
                                    bgColor={["hsl(269,80%,40%)", "rgb(53,162,255)"]}
                                />
                                <h3>Stock availability</h3>
                            </article>
                        ) : null}
                        {/* 4 */}
                        {adminCustomerRatio ? (
                            <article>
                                <DoughnutChartComponent
                                    legends={false}
                                    cutout={"60%"}
                                    data={[adminCustomerRatio.admin, adminCustomerRatio.customers]}
                                    offset={[0, 80]}
                                    labels={["Admin", "Customers"]}
                                    bgColor={["hsl(335,100%,38%)", "hsl(44,98%,50%)"]}
                                />
                                <h3>Admins & Customers</h3>
                            </article>
                        ) : null}
                    </section>
                </main>
            )}
        </div>
    );
};

export default PieCharts;
