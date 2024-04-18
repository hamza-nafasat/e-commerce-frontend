import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItemType } from "../types/types";

type ProductProps = {
    item: CartItemType;
    removeFromCartHandler: (productId: string) => void;
    IncrementHandler: (CartItem: CartItemType) => void;
    DecrementHandler: (CartItem: CartItemType) => void;
};

const CartItemCard = ({ item, removeFromCartHandler, DecrementHandler, IncrementHandler }: ProductProps) => {
    return (
        <div className="cartItem">
            <img src={item.photo.url} alt={item.name} />
            <article>
                <Link to={`/product/${item.productId}`}>{item.name}</Link>
                <span>{item.price} Rs</span>
            </article>
            <div>
                <button onClick={() => DecrementHandler(item)}>-</button>
                <p>{item.quantity}</p>
                <button onClick={() => IncrementHandler(item)}>+</button>
            </div>
            <button onClick={() => removeFromCartHandler(item.productId)}>
                <FaTrash />
            </button>
        </div>
    );
};

export default CartItemCard;
