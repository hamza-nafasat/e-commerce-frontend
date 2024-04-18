import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase";
import { getUserFromDb } from "./redux/api/userApi";
import { userExist, userNotExist } from "./redux/reducers/userReducer";
import { userReducerInitState } from "./types/reducer-types";

// =================================
// ========== USER ROUTES ==========
// =================================
const Home = lazy(() => import("./pages/Home"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
// NON AUTHENTICATED USER ONLY
const Login = lazy(() => import("./pages/Login"));
// AUTHENTIC USER ONLY
const Shipping = lazy(() => import("./pages/Shipping"));
const Orders = lazy(() => import("./pages/Orders"));
const CheckOut = lazy(() => import("./pages/CheckOut"));
// ==================================
// ========== ADMIN ROUTES ==========
// ==================================
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Transactions = lazy(() => import("./pages/admin/Transactions"));
// CHARTS
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
// APPS
const Toss = lazy(() => import("./pages/admin/apps/Toss"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
// MANAGEMENT
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductsManagement = lazy(() => import("./pages/admin/management/ProductsManagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/TransactionManagement"));

const App = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(
        (state: { userReducer: userReducerInitState }) => state.userReducer
    );

    // check user login or not with the help of firebase and redux
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getUserFromDb(user.uid);
                dispatch(userExist(data.data));
            } else {
                dispatch(userNotExist());
            }
        });
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <BrowserRouter>
            <Header user={user} />
            <Suspense fallback={<Loader />}>
                <Routes>
                    {/* ============================ */}
                    {/* ====== USER ROUTES ========= */}
                    {/* ============================ */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Cart />} />
                    {/* NON AUTHENTIC USER ONLY */}
                    <Route
                        path="/login"
                        element={
                            <ProtectedRoute isAuthenticated={user ? false : true}>
                                <Login />
                            </ProtectedRoute>
                        }
                    />
                    {/* AUTHENTIC USER ONLY */}
                    <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/checkout" element={<CheckOut />} />
                    </Route>
                    {/* ============================ */}
                    {/* ======== ADMIN ONLY ======== */}
                    {/* ============================ */}
                    <Route
                        element={
                            <ProtectedRoute
                                isAuthenticated={user ? true : false}
                                isAdmin={user?.role === "admin" ? true : false}
                                adminRoute={true}
                            />
                        }
                    >
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/products" element={<Products />} />
                        <Route path="/admin/customers" element={<Customers />} />
                        <Route path="/admin/transactions" element={<Transactions />} />
                        {/* CHARTS  */}
                        <Route path="/admin/charts/bar" element={<BarCharts />} />
                        <Route path="/admin/charts/pie" element={<PieCharts />} />
                        <Route path="/admin/charts/line" element={<LineCharts />} />
                        {/* APPS  */}
                        <Route path="/admin/app/toss" element={<Toss />} />
                        <Route path="/admin/app/coupon" element={<Coupon />} />
                        <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
                        {/* MANAGEMENT  */}
                        <Route path="/admin/product/new" element={<NewProduct />} />
                        <Route path="/admin/products/single/:id" element={<ProductsManagement />} />
                        <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
                    </Route>
                    {/* page not found route will be here */}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
            <Toaster position="top-right" />
        </BrowserRouter>
    );
};

export default App;
