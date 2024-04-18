import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import { Skeleton } from "../components/Loader";
import WithReactTable from "../components/admin/WithReactTable";
import { useMyAllOrdersQuery } from "../redux/api/orderApi";
import { StoreRootState } from "../redux/store/store";
import { CustomErrorType } from "../types/api-types";

interface OrderData {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    items: number;
    status: ReactElement;
}
const column: Column<OrderData>[] = [
    { Header: "ID", accessor: "_id" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Discount", accessor: "discount" },
    { Header: "Status", accessor: "status" },
    { Header: "Items", accessor: "items" },
];

const Orders = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);
    const { isError, isLoading, error, data } = useMyAllOrdersQuery(user?._id!);

    const [myOrderData, setMyOrderData] = useState<OrderData[]>([]);

    // error handling
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    // setting data in useEffect
    useEffect(() => {
        if (data) {
            const dataForTable = data.data.map((order) => ({
                _id: order._id,
                amount: order.total,
                discount: order.discount,
                quantity: order.cartItem.map((item) => item.quantity).reduce((a, b) => a + b, 0),
                status: (
                    <span
                        className={
                            order.status === "processing"
                                ? "red"
                                : order.status === "shipped"
                                ? "green"
                                : "blue"
                        }
                    >
                        {order.status}
                    </span>
                ),
                items: order.cartItem?.length,
            }));
            setMyOrderData(dataForTable);
        }
    }, [data]);

    // caching the table
    const myOrderTable = useCallback(
        WithReactTable<OrderData>(column, myOrderData, "reactTableBox", "", true, 10),
        [myOrderData]
    );
    // calling this and make a react component and return
    const TableComponent = myOrderTable();
    return isLoading ? (
        <Skeleton length={8} height="10vh" />
    ) : (
        <div className="container">{TableComponent}</div>
    );
};

export default Orders;
