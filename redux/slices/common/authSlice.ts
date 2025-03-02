import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthService from "../../../services/AuthService";

export const login = createAsyncThunk(
  "/auth/login",
  async (data: any, { rejectWithValue }) => {
    try {
      const user = await AuthService.login(data);
      console.log(user);

      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "/auth/logout",
  async (data: any, { rejectWithValue }) => {
    try {
      const user = await AuthService.logout();
      return user.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  error: "",
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        let userLoggedData = action.payload;
        console.log(userLoggedData);

        for (const key in userLoggedData) {
          if (userLoggedData.hasOwnProperty(key)) {
            const objectToStore = userLoggedData[key];
            const storageKey = `data_${key}`; // You can modify the key format as needed
            sessionStorage.setItem(storageKey, JSON.stringify(objectToStore));
          }
        }
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(logout.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.user = action.payload;
      })
      .addCase(logout.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// export const { createOrEdit } = authSlice.actions;

export default authSlice.reducer;
