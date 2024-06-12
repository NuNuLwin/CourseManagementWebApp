import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contentFileService from "./contentFileService";

const initialState = {
  contents: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// View Content file
export const viewContentFile = createAsyncThunk(
  "contents/viewContentFile",
  async (fileId, thunkAPI) => {
    try {
      return await contentFileService.viewContentFile(fileId);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// View Content file
export const uploadContentFile = createAsyncThunk(
  "contents/uploadContentFile",
  async ({ formData, config }, thunkAPI) => {
    try {
      return await contentFileService.uploadContentFile(formData, config);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewContentFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(viewContentFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = [action.payload];
      })
      .addCase(viewContentFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadContentFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadContentFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = [action.payload];
      })
      .addCase(uploadContentFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = contentSlice.actions;
export default contentSlice.reducer;
