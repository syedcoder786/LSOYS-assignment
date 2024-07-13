import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { isAxiosError } from "axios"
import { RootState } from '../store';
import { IUser, IAddressData } from "../../types/types";

// Define the types for your state
interface AuthState {
  user: IUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;

  // login
  isLoginError: boolean;
  isLoginSuccess: boolean;
  isLoginLoading: boolean;
  isLoginMessage: string | null;

  // register
  isRegisterError: boolean;
  isRegisterSuccess: boolean;
  isRegisterLoading: boolean;
  isRegisterMessage: string | null;

  // add address
  isAddAddressError: boolean;
  isAddAddressSuccess: boolean;
  isAddAddressLoading: boolean;
  isAddAddressMessage: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",

  // login
  isLoginError: false,
  isLoginSuccess: false,
  isLoginLoading: false,
  isLoginMessage: "",

  // register
  isRegisterError: false,
  isRegisterSuccess: false,
  isRegisterLoading: false,
  isRegisterMessage: "",

  // add address
  isAddAddressError: false,
  isAddAddressSuccess: false,
  isAddAddressLoading: false,
  isAddAddressMessage: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user: IUser, thunkAPI) => {
        try {
        return await authService.register(user);
        } catch (error) {
            let message: string;
            if (isAxiosError(error)) {
                message =
                (error.response?.data?.message || error.message || error.toString()) as string;
            } else {
                message = 'An unknown error occurred';
            }
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add Address
export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async (address: IAddressData, thunkAPI) => {
    try {
      console.log(address);
      const token = (thunkAPI.getState() as RootState).auth.user?.token || "";
      return await authService.addAddress(address, token);
    } catch (error) {
        let message: string;
        if (isAxiosError(error)) {
          message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        } else {
          message = 'An unknown error occurred';
        }
        return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (user: IUser, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error) {
        let message: string;
        if (isAxiosError(error)) {
          message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        } else {
          message = 'An unknown error occurred';
        }
        return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  return await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state: AuthState) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";

      // login
      state.isLoginError = false;
      state.isLoginSuccess = false;
      state.isLoginMessage = "";

      // register
      state.isRegisterError = false;
      state.isRegisterSuccess = false;
      state.isRegisterMessage = "";

      // add address
      state.isAddAddressError = false;
      state.isAddAddressSuccess = false;
      state.isAddAddressMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isRegisterLoading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isRegisterLoading = false;
        state.isRegisterSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.isRegisterError = true;
        if (typeof action.payload === 'string') {
            state.isRegisterMessage = action.payload;
          }
        // state.isRegisterMessage = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoginLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoginLoading = false;
        state.isLoginSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.isLoginSuccess = false;
        state.isLoginError = true;
        if (typeof action.payload === 'string') {
            state.isLoginMessage = action.payload;
        }
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(addAddress.pending, (state) => {
        state.isAddAddressLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isAddAddressLoading = false;
        state.isAddAddressSuccess = true;
        state.user = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isAddAddressLoading = false;
        state.isAddAddressError = true;
        if (typeof action.payload === 'string') {
            state.isAddAddressMessage = action.payload;
        }
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
