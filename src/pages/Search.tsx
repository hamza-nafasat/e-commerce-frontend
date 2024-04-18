import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import {
    useAllCategoriesQuery,
    useAllSearchProductQuery,
    useHighestPriceQuery,
} from "../redux/api/productApi";
import { CustomErrorType } from "../types/api-types";
import { CartItemType } from "../types/types";
import { addToCart } from "../redux/reducers/cartReducer";
import { useDispatch } from "react-redux";
const Search = () => {
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(10000);
    const [category, setCategory] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const dispatch = useDispatch();

    // get high price from all products data
    const {
        data: highPriceValue,
        isLoading: highPriceLoading,
        isError: highPriceIsError,
        error: highPriceError,
    } = useHighestPriceQuery("");
    // set high price to initial value of max price
    useEffect(() => {
        if (highPriceValue) setMaxPrice(highPriceValue.data[0].price);
    }, [highPriceValue]);
    // getting all categories dynamically
    const { data: categories, isError, error, isLoading: categoryLoading } = useAllCategoriesQuery("");
    // getting all search products data
    const {
        data: searchProducts,
        isError: isProductError,
        error: productError,
        isLoading: isProductLoading,
    } = useAllSearchProductQuery({ category, page, price: maxPrice, search, sort });
    // set disabling next and prev page
    const isNextPage = page < Number(searchProducts?.data?.totalPages) || 0;
    const isPrevPage = page > 1;

    // handle error
    if (isError) {
        const Error = error as CustomErrorType;
        toast.error(Error.data.message);
    }
    if (isProductError) {
        const Error = productError as CustomErrorType;
        toast.error(Error.data.message);
    }
    if (highPriceIsError) {
        const Error = highPriceError as CustomErrorType;
        toast.error(Error.data.message);
    }

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
    return (
        <div className="productSearchPage">
            {/* ====== Aside ======= */}
            {/* ==================== */}
            <aside>
                <h2>Filters</h2>
                {/* sort  */}
                <div>
                    <h4>Sort</h4>
                    <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Default</option>
                        <option value="ascending">Price (Low to High)</option>
                        <option value="descending">Price (High to Low)</option>
                    </select>
                </div>
                {/* maxPrice  */}
                <div>
                    <h4>Max Price: {maxPrice ?? ""}</h4>
                    <input
                        type="range"
                        min={500}
                        max={!highPriceLoading ? highPriceValue?.data[0].price : 500000}
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                </div>
                {/* sort  */}
                <div>
                    <h4>Categories</h4>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All</option>
                        {!categoryLoading &&
                            categories?.data.map((category, i) => (
                                <option key={i} value={`${category.toLowerCase()}`}>
                                    {category.toUpperCase()}
                                </option>
                            ))}
                    </select>
                </div>
            </aside>
            {/* ====== Main ======= */}
            {/* ==================== */}
            <main>
                <h2>Products</h2>
                <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/*  Products  */}
                <div className="searchProductsList">
                    {isProductLoading ? (
                        <Skeleton length={6} bgColor="gray" height="3rem" />
                    ) : (
                        searchProducts?.data?.filteredProducts.map((product) => (
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
                </div>
                {/*  Pagination  */}
                <article className="searchPagination">
                    <button onClick={() => setPage((pre) => pre - 1)} disabled={!isPrevPage}>
                        Prev
                    </button>
                    <span>
                        {page} of {searchProducts?.data?.totalPages}
                    </span>
                    <button onClick={() => setPage((pre) => pre + 1)} disabled={!isNextPage}>
                        Next
                    </button>
                </article>
            </main>
        </div>
    );
};

export default Search;
