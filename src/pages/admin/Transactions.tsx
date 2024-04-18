import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminAside from "../../components/admin/AdminAside";
import WithReactTable from "../../components/admin/WithReactTable";
import { useAllOrdersQuery } from "../../redux/api/orderApi";
import { StoreRootState } from "../../redux/store/store";
import { CustomErrorType } from "../../types/api-types";

interface TransactionsTableDataTypes {
    user: string;
    amount: number;
    discount: number;
    quantity: number;
    items: number;
    status: ReactElement;
    action: ReactElement;
}
const columns: Column<TransactionsTableDataTypes>[] = [
    { Header: "User", accessor: "user" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Discount", accessor: "discount" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Items", accessor: "items" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "action" },
];

const Transactions = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);
    const { isError, isLoading, error, data } = useAllOrdersQuery(user?._id!);

    const [transactionsTableData, setTransactionsTableData] = useState<TransactionsTableDataTypes[]>([]);
    // error handling
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    // setting data in useEffect
    useEffect(() => {
        if (data) {
            console.log(data);
            const dataForTable = data.data.map((order) => ({
                user: order.userId?.name || "Deleted User",
                amount: order.total,
                discount: order.discount,
                quantity: order.cartItem?.map((item) => item.quantity).reduce((a, b) => a + b, 0),
                items: order.cartItem?.length || 1,
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
                action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
            }));
            setTransactionsTableData(dataForTable);
        }
    }, [data]);
    // caching the table
    const transactionTable = useCallback(
        WithReactTable<TransactionsTableDataTypes>(
            columns,
            transactionsTableData,
            "reactTableBox",
            "Customers",
            true,
            7
        ),
        [transactionsTableData, columns]
    );
    // calling this and make a react component and return
    const TableComponent = transactionTable();
    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading ? (
                <Skeleton length={8} height="10vh" />
            ) : (
                <main style={{ overflowY: "auto" }}>{TableComponent}</main>
            )}
        </div>
    );
};

export default Transactions;
