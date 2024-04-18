import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminAside from "../../components/admin/AdminAside";
import WithReactTable from "../../components/admin/WithReactTable";
import { useAllAdminProductQuery } from "../../redux/api/productApi";
import { StoreRootState } from "../../redux/store/store";
import { CustomErrorType } from "../../types/api-types";

interface ProductsTableDataTypes {
    photo: ReactElement;
    name: string;
    price: number;
    stock: number;
    action: ReactElement;
}
const columns: Column<ProductsTableDataTypes>[] = [
    {
        Header: "Photo",
        accessor: "photo",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Price",
        accessor: "price",
    },
    {
        Header: "Stock",
        accessor: "stock",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Products = () => {
    const { user } = useSelector((state: StoreRootState) => state.userReducer);
    const { data, error, isError, isLoading } = useAllAdminProductQuery(user?._id!);

    const [tableData, setTableData] = useState<ProductsTableDataTypes[]>([]);
    // error handling
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    // setting data in useEffect
    useEffect(() => {
        if (data) {
            const dataForTable = data.data.map((product) => ({
                photo: <img src={product.photo.url} alt={product.name} />,
                price: product.price,
                name: product.name,
                stock: product.stock,
                action: <Link to={`single/${product._id}`}>Manage</Link>,
            }));
            setTableData(dataForTable);
        }
    }, [data]);
    // use call back hook for memoization
    const productTable = useCallback(
        WithReactTable<ProductsTableDataTypes>(columns, tableData, "reactTableBox", "Products", true),
        [tableData, columns]
    );
    // calling this and make a react component and return
    const TableComponent = productTable();
    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading ? (
                <Skeleton length={8} height="10vh" />
            ) : (
                <main style={{ overflowY: "auto" }}>{TableComponent}</main>
            )}
            <Link to={"/admin/product/new"} className="createProductButton">
                <FaPlus />
            </Link>
        </div>
    );
};

export default Products;
