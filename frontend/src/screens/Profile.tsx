import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  fetchUserRentedProducts,
  productSelector,
} from "../store/product/productSlice";
import { format, addDays } from "date-fns";
import { Spinner } from "flowbite-react";
import { authSelector } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    userRentedProdcuts,
    // isFetchUserRentedProductError: isError;
    // isFetchUserRentedProductSuccess: isSuccess;
    isFetchUserRentedProductLoading: isLoading,
    // isFetchUserRentedProductMessage: message;
  } = useAppSelector(productSelector);

  const { user } = useAppSelector(authSelector);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    dispatch(fetchUserRentedProducts());
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <img
                className="size-24 rounded-full object-cover"
                src={user?.profile_img}
                alt={user?.name}
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className=" text-gray-400">{user?.address?.street}</p>
                <p className=" text-gray-400">
                  {user?.address?.address1} {user?.address?.address2}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 bg-gray-700 px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold">Rented Products</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && (
                <Spinner aria-label="Spinner button example" size="xl" />
              )}
              {userRentedProdcuts?.map((product) => {
                const rentalStartDate = new Date(
                  product?.renterDetails?.createdAt ?? "",
                );
                const rentalDays = product?.renterDetails?.days ?? 0;
                const deliveryBackDate = addDays(rentalStartDate, rentalDays);
                return (
                  <div
                    key={product._id}
                    className="overflow-hidden rounded-lg bg-gray-800 shadow-lg"
                  >
                    <img
                      className="h-40 w-full object-cover"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{product.title}</h3>
                      <p>
                        <span className="text-slate-300">Rented on: </span>
                        <span className="text-green-400">
                          {format(
                            new Date(product?.renterDetails?.createdAt ?? ""),
                            "MMMM d, yyyy h:mm a",
                          )}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-300">
                          Deliver it back by :{" "}
                        </span>
                        <span className="text-red-400">
                          {format(deliveryBackDate, "MMMM d, yyyy h:mm a")}
                        </span>
                      </p>
                      <p className="mt-2 text-gray-400">
                        {product.description}
                      </p>
                      <p className="mt-2 text-gray-300">
                        <p>{product?.owner?.address?.street}</p>
                        <p>
                          {product?.owner?.address?.address1}{" "}
                          {product?.owner?.address?.address2}
                        </p>
                      </p>
                      <p className="my-2 text-orange-400">
                        Days Rented: {product?.renterDetails?.days}
                      </p>
                      <p className="my-2 text-yellow-400">
                        ₹{product?.price}/day
                      </p>
                      <p className="my-2 text-lg text-green-400">
                        Total Cost: ₹
                        {(product?.price ?? 0) *
                          (product?.renterDetails?.days ?? 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
