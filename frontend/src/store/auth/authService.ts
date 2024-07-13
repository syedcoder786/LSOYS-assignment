import axios from "axios";
import { proxy } from "../../config/default";
import { IUser, IAddressData } from "../../types/types";

const API_URL = `${proxy}/api/users/`;

// Register user
const register = async (userData: IUser): Promise<IUser> => {
  console.log(userData)
  const response = await axios.post<IUser>(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  console.log(response.data);
  return response.data;
};

// Add Address
const addAddress = async (addressData: IAddressData, token: string): Promise<IUser> => {
  console.log(addressData);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post<IUser>(
    API_URL + "addAddress",
    { address: addressData },
    config
  );

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
    // localStorage.setItem("cart", JSON.stringify(response.data.cart))
  }

  console.log(response.data);
  return response.data;
};

// Login user
const login = async (userData: IUser): Promise<IUser> => {
  const response = await axios.post<IUser>(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = (): void => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
  addAddress,
};

export default authService;
