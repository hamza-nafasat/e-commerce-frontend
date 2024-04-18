import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { addToCart } from "../redux/reducers/cartReducer";
import { CartItemType } from "../types/types";

const Home = () => {
    const { data, isLoading, isError } = useLatestProductsQuery("");
    const dispatch = useDispatch();

    // add to cart handler function
    const addToCartHandler = (cartItem: CartItemType) => {
        try {
            if (cartItem.stock < 1) return toast.error(`${cartItem.name} is out of stock`);
            dispatch(addToCart(cartItem));
            toast.success("Product Added To Cart");
            return;
        } catch (error) {
            toast.error("Product Already In Cart");
            throw error;
        }
    };

    if (isError) toast.error("Error While Fetching Latest Products");
    return (
        <div className="homePage">
            <img src={"/src/assets/img/cover.jpg"} alt="banner" loading="lazy" />
            <section>
                <h2>Latest Products</h2>
                <Link to={"/search"} className="findMore" aria-label="more products link">
                    More
                </Link>
            </section>
            <main>
                {isLoading ? (
                    <Skeleton />
                ) : (
                    data?.data.map((product) => (
                        <ProductCard
                            key={product._id}
                            productId={product._id}
                            name={product.name}
                            photo={product.photo}
                            stock={product.stock}
                            price={product.price}
                            handler={addToCartHandler}
                        />
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;
