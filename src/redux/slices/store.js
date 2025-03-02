import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: [],
  orderDetailIds: [],
};

const store = createSlice({
  name: "store",
  initialState,
  reducers: {
    SET_ORDER: (state, action) => {
      state.orderDetails = action.payload;
    },
    SET_ORDER_IDS: (state, action) => {
      state.orderDetailIds = action.payload;
    },
  },
});

const pageData = createSlice({
  name: "pageData",
  initialState: {
    categoryDetails: [],
    defaultCategory: {},
    supplierDetails: [],
    selectedCategory: {
      id: "",
      name: "",
      costing: "",
    },
    productDetails: [],
    cartDetails: []
  },
  reducers: {
    SET_CATEGORY_DETAILS: (state, action) => {
      state.categoryDetails = action.payload;
    },
    SET_DEFAULT_CATEGORY: (state, action) => {
      state.defaultCategory = action.payload;
    },
    SET_SUPPLIER_DETAILS: (state, action) => {
      state.supplierDetails = action.payload;
    },
    SET_SELECTED_CATEGORY: (state, action) => {
      Object.assign(state.selectedCategory, action.payload);
    },
    SET_PRODUCT_DETAILS: (state, action) => {
      state.productDetails = action.payload
    },
    SET_CART_DETAILS: (state, action) => {
      state.cartDetails = action.payload
    }
  },
});

const AccountInfo = createSlice({
  name: "AccountInfo",
  initialState:{
    dropdown:{}
  },
  reducers: {
    SET_DATA: (state, action) => {
      state.dropdown = {...state.dropdown,
                        ...action.payload}
    }
  },
});

export const { SET_DATA } = AccountInfo.actions;
export const { SET_ORDER, SET_ORDER_IDS } = store.actions;

export const {
  SET_CATEGORY_DETAILS,
  SET_DEFAULT_CATEGORY,
  SET_SUPPLIER_DETAILS,
  SET_SELECTED_CATEGORY,
  SET_PRODUCT_DETAILS,
  SET_CART_DETAILS
} = pageData.actions;

const storeDataReducers = {
  store: store.reducer,
  pageData: pageData.reducer,
  AccountInfo: AccountInfo.reducer
};

export default storeDataReducers;
