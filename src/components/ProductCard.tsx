import { FaPlus } from "react-icons/fa";
import { CartItemType } from "../types/types";

type ProductsProps = {
    productId: string;
    name: string;
    photo: {
        publicId: string;
        url: string;
    };
    stock: number;
    price: number;
    handler: (cartItem: CartItemType) => string | undefined;
};

const ProductCard = ({ handler, name, photo, price, productId, stock }: ProductsProps) => {
    return (
        <div className="productCard">
            <img src={photo?.url} alt={name} loading="lazy" />
            <p>{name}</p>
            <span>{price} Rs</span>
            <div>
                <button>
                    <FaPlus onClick={() => handler({ name, photo, price, productId, stock, quantity: 1 })} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
