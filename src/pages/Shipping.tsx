import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducers/cartReducer";
import { StoreRootState, backendServerUrl } from "../redux/store/store";

interface InitialState {
    address: string;
    state: string;
    city: string;
    country: string;
    pinCode: number;
}
const initialState: InitialState = {
    address: "",
    state: "",
    city: "",
    country: "",
    pinCode: 0,
};

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItem, total } = useSelector((state: StoreRootState) => state.cartReducer);
    const [shippingInfo, setShippingInfo] = useState<InitialState>(initialState);

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ ...shippingInfo, pinCode: Number(shippingInfo.pinCode) }));
        try {
            const { data } = await axios.post(
                `${backendServerUrl}/api/v1/payments/create`,
                { amount: total },
                { headers: { "Content-Type": "application/json" } }
            );
            if (!data) return toast.error("Some Error Occurred. Please Try Again Later");
            navigate("/checkout", { state: data.data.clientSecret });
            setShippingInfo(initialState);
        } catch (error) {
            console.log(error);
            toast.error("Some Error Occurred. Please Try Again Later");
            setShippingInfo(initialState);
        }
    };
    // navigate to cart if not any item in cart
    useEffect(() => {
        if (cartItem.length <= 0) navigate("/cart");
    }, [cartItem]);
    return (
        <div className="shippingPage">
            <Link to={"/cart"} className="backBtn">
                <BiArrowBack />
            </Link>
            <form onSubmit={submitHandler}>
                <h2>Shipping Info</h2>
                <input
                    required
                    autoFocus
                    id="address"
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    value={shippingInfo.address}
                    placeholder="Enter Your Address"
                    onChange={inputOnChangeHandler}
                />
                <input
                    required
                    id="state"
                    type="text"
                    name="state"
                    autoComplete="address-level1"
                    value={shippingInfo.state}
                    placeholder="Enter Your State"
                    onChange={inputOnChangeHandler}
                />
                <input
                    required
                    id="city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={shippingInfo.city}
                    placeholder="Enter Your City"
                    onChange={inputOnChangeHandler}
                />
                <select
                    required
                    id="country"
                    name="country"
                    autoComplete="country"
                    value={shippingInfo.country}
                    onChange={inputOnChangeHandler}
                >
                    <option value="">Choose Country</option>
                    <option value="pakistan">Pakistan</option>
                    <option value="india">India</option>
                </select>
                <input
                    required
                    id="pinCode"
                    type="number"
                    name="pinCode"
                    autoComplete="postal-code"
                    value={shippingInfo.pinCode}
                    placeholder="Enter Your PinCode"
                    onChange={inputOnChangeHandler}
                />
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Shipping;
