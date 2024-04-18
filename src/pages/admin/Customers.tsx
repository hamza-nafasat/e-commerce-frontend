import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminAside from "../../components/admin/AdminAside";
import WithReactTable from "../../components/admin/WithReactTable";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApi";
import { StoreRootState } from "../../redux/store/store";
import { CustomErrorType } from "../../types/api-types";
import { Skeleton } from "../../components/Loader";
import { User } from "../../types/types";
import { responseToast } from "../../utils/features";

interface CustomersTableDataTypes {
    avatar: ReactElement;
    name: string;
    gender: string;
    email: string;
    role: string;
    action: ReactElement;
}
const columns: Column<CustomersTableDataTypes>[] = [
    { Header: "Avatar", accessor: "avatar" },
    { Header: "Name", accessor: "name" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
    { Header: "Action", accessor: "action" },
];

const Customers = () => {
    const [CustomersTableData, setCustomersTableData] = useState<CustomersTableDataTypes[]>([]);
    const { user: loggedInUser } = useSelector((state: StoreRootState) => state.userReducer);
    const { data, error, isError, isLoading } = useAllUsersQuery(loggedInUser?._id!);
    const [deleteUser] = useDeleteUserMutation();
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);

    // error handling
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
    }
    // delete user function
    const deleteUserHandler = async (userId: string) => {
        try {
            setDeleteUserLoading(true);
            const response = await deleteUser({ myId: loggedInUser?._id!, userId });
            responseToast(response, null, "");
            setDeleteUserLoading(false);
        } catch (error) {
            setDeleteUserLoading(false);
            toast.error("SomeThing Wrong While Deleting User");
        }
    };
    // setting data in useEffect
    useEffect(() => {
        if (data) {
            const dataForTable = data.data.map((user: User) => ({
                avatar: (
                    <img
                        style={{
                            borderRadius: "50%",
                        }}
                        src={user.photo}
                        alt={user.name}
                    />
                ),
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user?.role!,
                action: (
                    <button disabled={deleteUserLoading} onClick={() => deleteUserHandler(user._id!)}>
                        <FaTrash />
                    </button>
                ),
            }));
            setCustomersTableData(dataForTable);
        }
    }, [data]);
    // use call back hook for memoization
    const customersTable = useCallback(
        WithReactTable<CustomersTableDataTypes>(
            columns,
            CustomersTableData,
            "reactTableBox",
            "Customers",
            true
        ),
        [CustomersTableData, columns]
    );
    // calling this and make a react component and return
    const TableComponent = customersTable();
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

export default Customers;
