import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
import { Skeleton } from "../components/Loader";
import { calculatePrise, discountApplied, removeFromCart, updateCart } from "../redux/reducers/cartReducer";
import { StoreRootState, backendServerUrl } from "../redux/store/store";
import { CartItemType } from "../types/types";

const Cart = () => {
    const dispatch = useDispatch();
    const { discount, isLoading, cartItem, shippingCharges, subtotal, tax, total } = useSelector(
        (state: StoreRootState) => state.cartReducer
    );

    const [coupon, setCoupon] = useState<string>("");
    const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);

    // remove from cart handler function
    const removeFromCartHandler = (productId: string) => {
        try {
            dispatch(removeFromCart(productId));
            toast.success("Product Removed From Cart");
            return;
        } catch (error) {
            toast.error("Error While Removing From Cart");
            throw error;
        }
    };
    // quantity increment handler function
    const IncrementHandler = (cartItem: CartItemType) => {
        try {
            if (cartItem.quantity >= cartItem.stock)
                return toast.error(`Only ${cartItem.stock} ${cartItem.name} left in stock`);
            dispatch(updateCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
        } catch (error) {
            toast.error("Error While Increasing Quantity");
            throw error;
        }
    };
    // quantity decrement handler function
    const DecrementHandler = (cartItem: CartItemType) => {
        try {
            if (cartItem.quantity === 1) return;
            dispatch(updateCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
        } catch (error) {
            toast.error("Error While Decreasing Quantity");
            throw error;
        }
    };
    // calculate the price and all other values in useEffect
    useEffect(() => {
        dispatch(calculatePrise());
    }, [cartItem]);
    // user effect to get and validate coupon
    useEffect(() => {
        const { token, cancel } = axios.CancelToken.source();
        let timOutId = setTimeout(() => {
            axios
                .get(`${backendServerUrl}/api/v1/payments/coupons/${coupon}`, {
                    cancelToken: token,
                })
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        setIsValidCoupon(true);
                        dispatch(discountApplied(res.data.data));
                    }
                })
                .catch((err) => {
                    if (err) setIsValidCoupon(false);
                    dispatch(discountApplied(0));
                });
            setIsValidCoupon((prev) => !prev);
        }, 1000);
        return () => {
            clearTimeout(timOutId);
            cancel("cancelled");
        };
    }, [coupon]);

    return (
        <div className="cartPage">
            <main>
                {isLoading ? (
                    <Skeleton />
                ) : cartItem.length > 0 ? (
                    cartItem.map((item, index) => (
                        <CartItemCard
                            key={index}
                            item={item}
                            IncrementHandler={IncrementHandler}
                            DecrementHandler={DecrementHandler}
                            removeFromCartHandler={removeFromCartHandler}
                        />
                    ))
                ) : (
                    <h2>your cart is empty</h2>
                )}
            </main>
            <aside>
                <p>Subtotal = {subtotal} Rs</p>
                <p>Shipping = {shippingCharges} Rs</p>
                <p>
                    Discount = <em className={discount > 0 ? "green" : "red"}> {discount} Rs</em>
                </p>
                <p>Tax = {tax} Rs</p>
                <p>
                    <b>Total Amount = {total} Rs</b>
                </p>
                <input
                    type="text"
                    spellCheck="false"
                    value={coupon}
                    placeholder="Enter Your Coupon Code"
                    onChange={(e) => setCoupon(e.target.value)}
                />
                {coupon ? (
                    isValidCoupon ? (
                        <span className="green">{discount} Rs Off Using This Coupon</span>
                    ) : (
                        <span className="red">
                            Invalid Coupon Code <VscError />
                        </span>
                    )
                ) : undefined}
                {cartItem.length > 0 ? <Link to={"/shipping"}>Checkout</Link> : undefined}
            </aside>
        </div>
    );
};

export default Cart;
