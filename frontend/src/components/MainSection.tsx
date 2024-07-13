import { Checkbox, Label, Spinner, Drawer, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  fetchProducts,
  productSelector,
  rentProduct,
  reset,
} from "../store/product/productSlice";
import { toast } from "react-toastify";
import { IProduct } from "../types/types";
import GoogleMapsComponent from "../components/GoogleMapsComponent";
import { authSelector } from "../store/auth/authSlice";
import { HiExclamation } from "react-icons/hi";

const Filter: React.FC = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  return (
    <div className="h-full bg-gray-800 p-4 text-white">
      <h2 className="mb-4 text-xl font-bold">Filters</h2>
      <div className="mb-4">
        <label className="mb-2 block">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block">Price/Day Range</label>
        <div className="">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full"
          />
          <p>{`$0 - $${priceRange[1]}`}</p>
        </div>
      </div>
      <div className="my-4 flex items-center gap-2">
        <Checkbox id="agree" />
        <Label htmlFor="agree" className="flex">
          Available for rent
        </Label>
      </div>
      <div className="mb-4">
        <label className="mb-2 block">Sort By...</label>
        <select className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white">
          <option>None</option>
          <option>Price - Low to High</option>
          <option>Price - Hign to Low</option>
          <option>Date</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mb-2 block">Location</label>
        <input
          type="text"
          placeholder="Enter location..."
          className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
        />
      </div>
      {/* Add more filters as needed */}
    </div>
  );
};

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    isFetchProductLoading: isLoading,
    isFetchProductError: isError,
    isFetchProductSuccess: isSuccess,
    isFetchProductMessage: message,

    isRentProductLoading: isRentLoading,
    isRentProductError: isRentError,
    isRentProductSuccess: isRentSuccess,
    isRentProductMessage: rentmessage,
  } = useAppSelector(productSelector);

  const { user } = useAppSelector(authSelector);

  const [oneProduct, setOneProduct] = useState<IProduct | null>(null);

  const [errmsg, setErrmsg] = useState("");

  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.log(message);
      toast.error(message);
    }

    if (isSuccess) {
      console.log("success product/fetch");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    if (isRentError) {
      console.log(rentmessage);
      setErrmsg(rentmessage);
    }

    if (isRentSuccess) {
      toast.success("Rented!");
      setIsOpen(false);
      console.log("success product/rent");
    }

    dispatch(reset());
  }, [isRentError, isRentSuccess, rentmessage, dispatch]);

  const handleRent = () => {
    if (!days) {
      return setErrmsg("Select number of days to rent");
    }
    if (!oneProduct?.owner?._id) {
      return setErrmsg("Product owner is not defined");
    }

    if (oneProduct._id) {
      const renterDetails = {
        id: oneProduct?._id,
        days: days,
      };

      dispatch(rentProduct(renterDetails));
    } else {
      return setErrmsg("Product not loaded");
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading && (
        <Spinner
          aria-label="Spinner button example"
          size="xl"
          className="w-full"
        />
      )}
      {products?.map((product) => (
        <div
          key={product._id}
          className="rounded border border-gray-700 bg-gray-900 p-4 text-white"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="mb-4 h-48 w-full rounded object-cover"
          />
          <div className="mb-2 flex items-center">
            <img
              src={product.owner?.profile_img}
              alt={product.owner?.name}
              className="mr-2 size-10 rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold">{product.owner?.name}</h3>
              {/* <p className="text-sm text-gray-400">{product.createdAt}</p> */}
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold">{product.title}</h3>
          <p className="text-gray-400">{product.owner?.address?.street}</p>
          <p className="text-gray-400">
            {product.owner?.address?.address1}{" "}
            {product.owner?.address?.address2}
          </p>
          <p className="my-2">{product.description}</p>
          <p className="mb-4 text-lg font-semibold">₹ {product?.price}/day</p>
          {product?.available ? (
            user ? (
              user?._id !== product.owner?._id && (
                <button
                  onClick={() => {
                    if (user) {
                      setIsOpen(true);
                      setOneProduct(product);
                    }
                  }}
                  className="w-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Rent
                </button>
              )
            ) : (
              <button
                onClick={() => {
                  if (user) {
                    setIsOpen(true);
                    setOneProduct(product);
                  } else {
                    toast.error("Please Login to rent");
                  }
                }}
                className="w-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Rent
              </button>
            )
          ) : (
            <button className="w-full bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700">
              Rented
            </button>
          )}
        </div>
      ))}

      <Drawer
        backdrop={false}
        open={isOpen}
        onClose={handleClose}
        position="right"
        className="fixed z-50 w-2/5"
      >
        <Drawer.Header title={oneProduct?.title} />
        <Drawer.Items>
          <div className="rounded border border-gray-700 bg-gray-900 p-4 text-white">
            <img
              src={oneProduct?.imageUrl}
              alt={oneProduct?.title}
              className="mb-4 h-48 w-full rounded object-cover"
            />
            <div className="mb-2 flex items-center">
              <img
                src={oneProduct?.owner?.profile_img}
                alt={oneProduct?.owner?.name}
                className="mr-2 size-10 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">{oneProduct?.owner?.name}</h3>
                {/* <p className="text-sm text-gray-400">{oneProduct?.createdAt}</p> */}
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-bold">{oneProduct?.title}</h3>
            <p className="my-2">{oneProduct?.description}</p>
            <GoogleMapsComponent
              ownerCoords={
                oneProduct?.owner?.address?.coords || { lat: 0, lng: 0 }
              }
              renterCoords={user?.address?.coords || { lat: 0, lng: 0 }}
            />
            <div className="my-1 text-lg">
              <p className="mt-2 text-gray-400">
                {oneProduct?.owner?.address?.street}
              </p>
              <p className="text-gray-400">
                {oneProduct?.owner?.address?.address1}{" "}
                {oneProduct?.owner?.address?.address2}
              </p>
            </div>

            <p className=" text-lg font-semibold">₹ {oneProduct?.price}/day</p>
            <div className="mb-4">
              {errmsg && (
                <Toast className="my-2">
                  <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                    <HiExclamation className="size-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">{errmsg}</div>
                  <Toast.Toggle onDismiss={() => setErrmsg("")} />
                </Toast>
              )}
              <label className="mr-2" htmlFor="price">
                Number of days to rent:
              </label>
              <input
                className="w-1/4 rounded border border-gray-600 bg-gray-700 p-2 focus:border-blue-500 focus:outline-none"
                type="number"
                name="price"
                min={0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDays(Number(e.target.value))
                }
                value={days}
                required
              />
            </div>
            <button
              onClick={handleRent}
              className="w-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {isRentLoading && (
                <Spinner
                  aria-label="Spinner button example"
                  size="md"
                  className="mr-2"
                />
              )}
              Rent
            </button>
          </div>
        </Drawer.Items>
      </Drawer>
    </div>
  );
};

const MainSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:flex">
      <div className="md:sticky md:top-20 md:h-[80vh] md:w-1/4">
        <Filter />
      </div>
      <div className="overflow-y-auto md:w-3/4">
        <ProductList />
      </div>
    </div>
  );
};

export default MainSection;
