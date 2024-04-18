import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminAside from "../../../components/admin/AdminAside";
import { useCreateNewProductMutation } from "../../../redux/api/productApi";
import { StoreRootState } from "../../../redux/store/store";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [price, setPrice] = useState<number>();
    const [stock, setStock] = useState<number>();
    const [photo, setPhoto] = useState<File | undefined>();
    const [previewPhoto, setPreviewPhoto] = useState<string>("");
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user } = useSelector((state: StoreRootState) => state.userReducer);

    const [createNewProduct] = useCreateNewProductMutation();
    // change photo handler function
    const changePhotoHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        setPhoto(file);
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") setPreviewPhoto(reader.result);
            };
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonLoading(true);
        if (!photo || !name || (stock && stock < 0) || !category || !price) {
            toast.error("Please Enter All Upper Fields First");
            setButtonLoading(false);
            return;
        }
        // making form data
        try {
            let formData = new FormData();
            formData.set("name", name);
            formData.set("price", String(price));
            formData.set("stock", String(stock));
            formData.set("category", category);
            formData.set("photo", photo);
            const res = await createNewProduct({ id: user?._id!, formData });
            responseToast(res, navigate, "/admin/products");
            setButtonLoading(false);
        } catch (error) {
            setButtonLoading(false);
            console.log(error);
        }
    };
    return (
        <div className="adminContainer">
            <AdminAside />
            <main className="newProductContainer">
                <article>
                    <form onSubmit={handleSubmit}>
                        <h2>New Product</h2>
                        <div>
                            <label htmlFor="newProductName">Name:</label>
                            <input
                                required
                                type="text"
                                value={name}
                                id="newProductName"
                                placeholder="Enter product name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newProductPrice">Price:</label>
                            <input
                                required
                                type="number"
                                value={price}
                                id="newProductPrice"
                                placeholder="Enter product price"
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="newProductCategory">Category:</label>
                            <input
                                required
                                type="text"
                                value={category}
                                id="newProductCategory"
                                placeholder="Enter product Category"
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newProductStock">Stock:</label>
                            <input
                                required
                                type="number"
                                value={stock}
                                id="newProductStock"
                                placeholder="Enter product stock"
                                onChange={(e) => setStock(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="newProductPhoto">Photo:</label>
                            <input required type="file" id="newProductPhoto" onChange={changePhotoHandler} />
                        </div>
                        {previewPhoto ? <img src={previewPhoto} alt="new product Photo" /> : null}
                        <button disabled={buttonLoading} type="submit">
                            Create
                        </button>
                    </form>
                </article>
            </main>
        </div>
    );
};

export default NewProduct;
