import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AdminAside from "../../../components/admin/AdminAside";
import { BarChartComponent } from "../../../components/admin/Charts";
import { useBarChartStateQuery } from "../../../redux/api/adminApi";
import { StoreRootState } from "../../../redux/store/store";
import { CustomErrorType } from "../../../types/api-types";
import { getLastYearMonths } from "../../../utils/getLastYearMonths";

const BarCharts = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);
    const { data, isLoading, isError, error } = useBarChartStateQuery(user?._id!);
    // error handling for dashboard
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }

    const barChart = data?.data!;
    const orderArr = barChart?.lastYearOrdersArr;
    const productsAndCustomers = barChart?.sixMonthProductsAndCustomers;

    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading || isError ? (
                <Loader />
            ) : (
                <main className="barChartsContainer">
                    <h2>Bar Charts</h2>
                    {productsAndCustomers ? (
                        <section>
                            <BarChartComponent
                                bgColor_1={`hsl(260,50%,30%)`}
                                bgColor_2={`hsl(360,90%,90%)`}
                                data_1={barChart.sixMonthProductsAndCustomers.products}
                                data_2={barChart.sixMonthProductsAndCustomers.Customers}
                                title_1="Products"
                                title_2="Customers"
                                barThickness={0.4}
                            />
                            <h3>TOP SELLING PRODUCTS & CUSTOMERS</h3>
                        </section>
                    ) : null}
                    {orderArr ? (
                        <section>
                            <BarChartComponent
                                bgColor_1={`hsl(180, 40%, 50%)`}
                                data_1={barChart.lastYearOrdersArr}
                                title_1="Orders"
                                horizontal={true}
                                labels={getLastYearMonths()}
                                barThickness={0.2}
                                barWidth={"200%"}
                            />
                            <h3>ORDERS THROUGHOUT THE YEAR</h3>
                        </section>
                    ) : null}
                </main>
            )}
        </div>
    );
};

export default BarCharts;
