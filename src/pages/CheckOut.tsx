import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducers/cartReducer";
import { StoreRootState } from "../redux/store/store";
import { userReducerInitState } from "../types/reducer-types";
import { NewOrderDateTypes } from "../types/types";
import { responseToast } from "../utils/features";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
    const { user } = useSelector((state: { userReducer: userReducerInitState }) => state.userReducer);
    const { subtotal, tax, shippingCharges, total, discount, cartItem, shippingInfo } = useSelector(
        (state: StoreRootState) => state.cartReducer
    );

    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [createOrder] = useCreateOrderMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const submitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!stripe || !elements) return;
            setIsProcessing(true);
            const newOrderData: NewOrderDateTypes = {
                userId: user?._id!,
                subtotal,
                tax: tax,
                shippingCharges: shippingCharges,
                discount: discount,
                total: total,
                shippingInfo: shippingInfo,
                cartItem: cartItem,
            };
            console.log(newOrderData);
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: window.location.origin },
                redirect: "if_required",
            });
            if (error) {
                setIsProcessing(false);
                toast.error(error.message || "Error While Processing Payment");
            }
            if (paymentIntent?.status === "succeeded") {
                const res = await createOrder(newOrderData);
                dispatch(resetCart());
                responseToast(res, navigate, "/orders");
            }
            setIsProcessing(false);
        } catch (error) {
            toast.error("Error While Processing Payment");
            setIsProcessing(false);
        }
    };
    return (
        <div className="checkoutForm">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button disabled={isProcessing}>{isProcessing ? "Processing..." : "Pay now"}</button>
            </form>
        </div>
    );
};

const CheckOut = () => {
    const location = useLocation();
    const clientSecret = location.state;
    if (!clientSecret) return <Navigate to={"/cart"} />;
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
};

export default CheckOut;
