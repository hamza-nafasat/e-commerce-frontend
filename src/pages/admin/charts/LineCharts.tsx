import { useSelector } from "react-redux";
import AdminAside from "../../../components/admin/AdminAside";
import { LineChartComponent } from "../../../components/admin/Charts";
import { StoreRootState } from "../../../redux/store/store";
import { useLineChartStateQuery } from "../../../redux/api/adminApi";
import { CustomErrorType } from "../../../types/api-types";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";

const LineChart = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);

    const { data, isLoading, isError, error } = useLineChartStateQuery(user?._id!);
    // error handling for dashboard
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }

    const lineChart = data?.data!;

    const discountArr = lineChart?.oneYearDiscountsArr;
    const productsArr = lineChart?.oneYearProductsArr;
    const revenueArr = lineChart?.oneYearRevenueArr;
    const usersArr = lineChart?.oneYearUserArr;
    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading || isError ? (
                <Loader />
            ) : (
                <main className="LineChartsContainer">
                    <h2>Line Charts</h2>
                    {/* ACTIVE USERS CHART  */}
                    {/* =================== */}
                    {usersArr ? (
                        <section>
                            <LineChartComponent
                                data={usersArr}
                                title="Users"
                                borderColor="rgb(53,162,255)"
                                bgColor="rgba(53,162,255,0.5)"
                            />
                            <h3>Active users</h3>
                        </section>
                    ) : null}
                    {/* TOTAL PRODUCTS CHART  */}
                    {/* ===================== */}
                    {productsArr ? (
                        <section>
                            <LineChartComponent
                                data={productsArr}
                                bgColor={"hsla(269,80%,40%,0.4)"}
                                borderColor={"hsl(269,80%,40%)"}
                                title="Products"
                            />
                            <h3>Total products (sku)</h3>
                        </section>
                    ) : null}
                    {/* TOTAL REVENUE CHART  */}
                    {/* ==================== */}
                    {revenueArr ? (
                        <section>
                            <LineChartComponent
                                data={revenueArr}
                                bgColor={"hsla(129,80%,40%,0.4)"}
                                borderColor={"hsl(129,80%,40%)"}
                                title="Revenue"
                            />
                            <h3>Total revenue</h3>
                        </section>
                    ) : null}
                    {/* DISCOUNT ALLOTED CHART  */}
                    {/* ======================= */}
                    {discountArr ? (
                        <section>
                            <LineChartComponent
                                data={discountArr}
                                bgColor={"hsla(29,80%,40%,0.4)"}
                                borderColor={"hsl(29,80%,40%)"}
                                title="Discount"
                            />
                            <h3>Discount alloted</h3>
                        </section>
                    ) : null}
                </main>
            )}
        </div>
    );
};

export default LineChart;
