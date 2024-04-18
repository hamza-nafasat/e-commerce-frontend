import { Column } from "react-table";
import WithReactTable from "./WithReactTable";
import { TransactionItem } from "../../types/types";

const columns: Column<TransactionItem>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Items",
        accessor: "items",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Price",
        accessor: "price",
    },
    {
        Header: "Status",
        accessor: "status",
    },
];

const DashboardTable = ({ tableData = [] }: { tableData: TransactionItem[] }) => {
    return WithReactTable<TransactionItem>(columns, tableData, "reactTableContainer", "Top Transactions")();
};

export default DashboardTable;
