import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import productService from './productService';
import { IProduct } from '../../types/types';
import axios from 'axios';

interface ProductState {
  products: IProduct[] | null;
  userRentedProdcuts: IProduct[] | null;
  product: IProduct | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;

  isAddProductError: boolean;
  isAddProductSuccess: boolean;
  isAddProductLoading: boolean;
  isAddProductMessage: string;

  isRentProductError: boolean;
  isRentProductSuccess: boolean;
  isRentProductLoading: boolean;
  isRentProductMessage: string;

  isFetchProductError: boolean;
  isFetchProductSuccess: boolean;
  isFetchProductLoading: boolean;
  isFetchProductMessage: string;

  isFetchUserRentedProductError: boolean;
  isFetchUserRentedProductSuccess: boolean;
  isFetchUserRentedProductLoading: boolean;
  isFetchUserRentedProductMessage: string;

  isFetchOneProductError: boolean;
  isFetchOneProductSuccess: boolean;
  isFetchOneProductLoading: boolean;
  isFetchOneProductMessage: string;
}

const initialState: ProductState = {
  products: null,
  userRentedProdcuts: null,
  product: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

  isAddProductError: false,
  isAddProductSuccess: false,
  isAddProductLoading: false,
  isAddProductMessage: '',

  isRentProductError: false,
  isRentProductSuccess: false,
  isRentProductLoading: false,
  isRentProductMessage: '',

  isFetchProductError: false,
  isFetchProductSuccess: false,
  isFetchProductLoading: false,
  isFetchProductMessage: '',

  isFetchUserRentedProductError: false,
  isFetchUserRentedProductSuccess: false,
  isFetchUserRentedProductLoading: false,
  isFetchUserRentedProductMessage: '',

  isFetchOneProductError: false,
  isFetchOneProductSuccess: false,
  isFetchOneProductLoading: false,
  isFetchOneProductMessage: '',
};

// Create new product
export const createProduct = createAsyncThunk<IProduct, IProduct, { state: RootState }>(
  'product/add',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await productService.addProduct(productData, token || "");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || error.toString();
      } else {
        message = (error as Error).message;
      }
      if (!thunkAPI.getState().auth.user) {
        message = 'Please LogIn to add product';
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create rent product
export const rentProduct = createAsyncThunk<IProduct, {id:string, days: number}, { state: RootState }>(
  'product/rent',
  async (renterDetails, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await productService.rentProduct(renterDetails, token || "");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || error.toString();
      } else {
        message = (error as Error).message;
      }
      if (!thunkAPI.getState().auth.user) {
        message = 'Please LogIn to add product';
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch products
export const fetchProducts = createAsyncThunk<IProduct[], void, { state: RootState }>(
  'product/fetch',
  async (_, thunkAPI) => {
    try {
      return await productService.fetchProducts();
    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || error.toString();
      } else {
        message = (error as Error).message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch products
export const fetchUserRentedProducts = createAsyncThunk<IProduct[], void, { state: RootState }>(
  'product/fetchUserRented',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await productService.fetchUserRentedProducts(token || "");
    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || error.toString();
      } else {
        message = (error as Error).message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch one product
export const fetchOneProduct = createAsyncThunk<IProduct, string, { state: RootState }>(
  'productOne/fetch',
  async (dataId, thunkAPI) => {
    try {
      return await productService.fetchOneProduct(dataId);
    } catch (error) {
      let message;
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || error.toString();
      } else {
        message = (error as Error).message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';

      state.isAddProductError = false;
      state.isAddProductSuccess = false;
      state.isAddProductMessage = '';

      state.isRentProductError = false;
      state.isRentProductSuccess = false;
      state.isRentProductMessage = '';

      state.isFetchProductError = false;
      state.isFetchProductSuccess = false;
      state.isFetchProductMessage = '';

      state.isFetchOneProductError = false;
      state.isFetchOneProductSuccess = false;
      state.isFetchOneProductMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isAddProductLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isAddProductLoading = false;
        state.isAddProductSuccess = true;
        if (state.products) {
          state.products = [action.payload, ...state.products];
        } else {
          state.products = [action.payload];
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isAddProductLoading = false;
        state.isAddProductError = true;
        if (typeof action.payload === 'string') {
            state.isAddProductMessage = action.payload;
          }
      })
      .addCase(rentProduct.pending, (state) => {
        state.isRentProductLoading = true;
      })
      .addCase(rentProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isRentProductLoading = false;
        state.isRentProductSuccess = true;
        const newProduct = action.payload;
        console.log(newProduct)
        if(state.products)
          state.products = state.products.map(product =>
            product._id === newProduct._id ? newProduct : product
          );

      })
      .addCase(rentProduct.rejected, (state, action) => {
        state.isRentProductLoading = false;
        state.isRentProductError = true;
        if (typeof action.payload === 'string') {
            state.isRentProductMessage = action.payload;
          }
      })
      .addCase(fetchProducts.pending, (state) => {
        state.isFetchProductLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.isFetchProductLoading = false;
        state.isFetchProductSuccess = true;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isFetchProductLoading = false;
        state.isFetchProductError = true;
        if (typeof action.payload === 'string') {
            state.isFetchProductMessage = action.payload;
        }
      })

      .addCase(fetchUserRentedProducts.pending, (state) => {
        state.isFetchUserRentedProductLoading = true;
      })
      .addCase(fetchUserRentedProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.isFetchUserRentedProductLoading = false;
        state.isFetchUserRentedProductSuccess = true;
        state.userRentedProdcuts = action.payload;
      })
      .addCase(fetchUserRentedProducts.rejected, (state, action) => {
        state.isFetchUserRentedProductLoading = false;
        state.isFetchUserRentedProductError = true;
        if (typeof action.payload === 'string') {
            state.isFetchUserRentedProductMessage = action.payload;
        }
      })

      .addCase(fetchOneProduct.pending, (state) => {
        state.isFetchOneProductLoading = true;
      })
      .addCase(fetchOneProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.isFetchOneProductLoading = false;
        state.isFetchOneProductSuccess = true;
        state.product = action.payload;
      })
      .addCase(fetchOneProduct.rejected, (state, action) => {
        state.isFetchOneProductLoading = false;
        state.isFetchOneProductError = true;
        if (typeof action.payload === 'string') {
            state.isFetchOneProductMessage = action.payload;
        }
      });
  },
});

export const { reset } = productSlice.actions;
export const productSelector = (state: RootState) => state.product;
export default productSlice.reducer;
