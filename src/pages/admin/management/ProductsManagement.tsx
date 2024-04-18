import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import AdminAside from "../../../components/admin/AdminAside";
import {
    useDeleteSingleProductMutation,
    useSingleProductQuery,
    useUpdateSingleProductMutation,
} from "../../../redux/api/productApi";
import { StoreRootState } from "../../../redux/store/store";
import { CustomErrorType } from "../../../types/api-types";
import { responseToast } from "../../../utils/features";

const ProductsManagement = () => {
    const params = useParams();
    const navigate = useNavigate();
    console.log(params);
    const { user } = useSelector((state: StoreRootState) => state.userReducer);
    const { data, isLoading, isError, error } = useSingleProductQuery(params.id!);
    // initial data for update
    const { _id, category, name, photo, price, stock } = data?.data || {
        _id: "",
        name: "",
        price: 0,
        stock: 0,
        photo: { publicId: "", url: "" },
        category: "",
    };
    const [updatedName, setUpdatedName] = useState<string>(name);
    const [updatedPrice, setUpdatedPrice] = useState<number>(price);
    const [updatedStock, setUpdatedStock] = useState<number>(stock);
    const [updatedPhoto, setUpdatedPhoto] = useState<string>(photo.url);
    const [updatedCategory, setUpdatedCategory] = useState<string>(category);
    const [photoFile, setPhotoFile] = useState<File | string>("");
    const [isProductUpdateLoading, setIsProductUpdateLoading] = useState<boolean>(false);

    const [updateProduct] = useUpdateSingleProductMutation();
    const [deleteProduct] = useDeleteSingleProductMutation();

    // handling error
    if (isError) {
        const err = error as CustomErrorType;
        toast.error(err.data.message);
        // navigate("/404");
        return;
    }
    // when we want to change photo then this function handle
    const changePhotoHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        const reader: FileReader = new FileReader();
        if (file) {
            setPhotoFile(file);
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") setUpdatedPhoto(reader.result);
            };
        }
    };
    // update product according data
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsProductUpdateLoading(true);
        e.preventDefault();
        let formData = new FormData();
        if (updatedName) formData.set("name", updatedName);
        if (updatedCategory) formData.set("category", updatedCategory);
        if (updatedPrice) formData.set("price", String(updatedPrice));
        if (updatedStock || updatedStock === 0) formData.set("stock", String(updatedStock));
        if (photoFile) formData.set("photo", photoFile);
        try {
            const response = await updateProduct({ formData, userId: user?._id!, productId: _id });
            responseToast(response, navigate, "/admin/products");
            setIsProductUpdateLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something Wrong While Updating Product.");
            setIsProductUpdateLoading(false);
        }
    };
    // delete product
    const deleteProductHandler = async () => {
        setIsProductUpdateLoading(true);
        try {
            const response = await deleteProduct({ userId: user?._id!, productId: _id });
            responseToast(response, navigate, "/admin/products");
            setIsProductUpdateLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something Wrong While Deleting Product.");
            setIsProductUpdateLoading(false);
        }
    };
    // adding data to use states using use effect
    // ------------------------------------------
    useEffect(() => {
        if (data?.data) {
            setUpdatedName(data.data.name);
            setUpdatedPrice(data.data.price);
            setUpdatedStock(data.data.stock);
            setUpdatedCategory(data.data.category);
        }
    }, [data]);

    return (
        <div className="adminContainer">
            <AdminAside />
            {isLoading ? (
                <Loader />
            ) : (
                <main className="ProductsManagementContainer">
                    {/* FIRST SECTION FOR SHOWING OLD DATA */}
                    {/* ================================== */}
                    <section>
                        <strong>ID - {_id}</strong>
                        <img src={photo.url} alt="product Photo" width={500} height="auto" />
                        <p>{name}</p>
                        {stock > 0 ? (
                            <span className="green">{stock} Available</span>
                        ) : (
                            <span className="red">Not Available</span>
                        )}
                        <h3>{price}-PKR</h3>
                        <button
                            className="trash"
                            onClick={deleteProductHandler}
                            style={{
                                opacity: isProductUpdateLoading ? 0.3 : 1,
                                cursor: isProductUpdateLoading ? "not-allowed" : "pointer",
                            }}
                        >
                            <FaTrash />
                        </button>
                    </section>
                    {/* SECOND ARTICLE FOR NEW DATA FORM */}
                    {/* ================================ */}
                    <article>
                        <form onSubmit={handleSubmit}>
                            <h2>Manage</h2>
                            <div>
                                <label htmlFor="productName">Name:</label>
                                <input
                                    type="text"
                                    value={updatedName}
                                    id="productName"
                                    placeholder="Enter product name"
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="productPrice">Price:</label>
                                <input
                                    type="number"
                                    value={updatedPrice}
                                    id="productPrice"
                                    placeholder="Enter product price"
                                    onChange={(e) => setUpdatedPrice(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label htmlFor="productStock">Stock:</label>
                                <input
                                    type="number"
                                    value={updatedStock}
                                    id="productStock"
                                    placeholder="Enter product stock"
                                    onChange={(e) => setUpdatedStock(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label htmlFor="productCategory">Category:</label>
                                <input
                                    type="text"
                                    value={updatedCategory}
                                    id="productCategory"
                                    placeholder="Enter product category"
                                    onChange={(e) => setUpdatedCategory(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="productPhoto">Photo:</label>
                                <input type="file" id="productPhoto" onChange={changePhotoHandler} />
                            </div>
                            {updatedPhoto ? <img src={updatedPhoto} alt="new product Photo" /> : null}
                            <button disabled={isProductUpdateLoading} type="submit">
                                Update
                            </button>
                        </form>
                    </article>
                </main>
            )}
        </div>
    );
};

export default ProductsManagement;
