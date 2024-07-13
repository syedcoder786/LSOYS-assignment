import { Button, Spinner, Toast } from "flowbite-react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { HiExclamation } from "react-icons/hi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  createProduct,
  productSelector,
  reset,
} from "../store/product/productSlice";
import { toast } from "react-toastify";

interface Product {
  image: File | null;
  title: string;
  price: number;
  description: string;
}

const AddProduct: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    // products,
    isAddProductLoading: isLoading,
    isAddProductError: isError,
    isAddProductSuccess: isSuccess,
    isAddProductMessage: message,
  } = useAppSelector(productSelector);

  const [product, setProduct] = useState<Product>({
    image: null,
    title: "",
    price: 0,
    description: "",
  });

  const { image, title, price, description } = product;

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [imgLoading, setImgLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isError) {
      setErrorMsg(message);
      setImgLoading(false);
    }

    if (isSuccess) {
      setProduct({
        image: null,
        title: "",
        price: 0,
        description: "",
      });
      setImgLoading(false);

      toast.warning("Product sent for Admin review!");
      console.log("success");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: files[0],
      }));
    }
  };

  const uploadFile = async (imageUpload: File | null) => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image || !title || !description) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (title.length < 3) {
      return setErrorMsg("Title length can't be less than 3 characters");
    }

    if (price < 0) {
      return setErrorMsg("Price cannot be negative");
    }

    // Reset error message
    setErrorMsg("");

    let imageUrl;
    try {
      setImgLoading(true);
      imageUrl = await uploadFile(image);
    } catch (e) {
      console.log(e);
      setImgLoading(false);
      return setErrorMsg("Error in file upload");
    } finally {
      const newProduct = {
        imageUrl,
        title,
        price,
        description,
      };
      console.log(newProduct);

      dispatch(createProduct(newProduct));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg rounded-lg bg-slate-800 p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold">Add New Product</h1>
        {errorMsg && (
          <Toast>
            <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg  bg-orange-700 text-orange-200">
              <HiExclamation className="size-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{errorMsg}</div>
            <Toast.Toggle onDismiss={() => setErrorMsg("")} />
          </Toast>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="imageUrl"
            >
              Image
            </label>
            <input
              className=" w-full rounded border border-gray-600 bg-gray-700 focus:border-blue-500 focus:outline-none"
              type="file"
              name="imageUrl"
              accept=".jpg, .png, .jpeg, .gif|image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="title">
              Title
            </label>
            <input
              className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:outline-none"
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="price">
              Price
            </label>
            <input
              className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:outline-none"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:outline-none"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full">
            {(imgLoading || isLoading) && (
              <Spinner
                aria-label="Spinner button example"
                size="md"
                className="mr-2"
              />
            )}
            Add Product
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
