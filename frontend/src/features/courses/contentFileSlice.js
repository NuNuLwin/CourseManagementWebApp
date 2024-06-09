import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contentFileService from "./contentFileService";

const initialState = {
  contents: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get course content by category id and course id
export const getCourseContent = createAsyncThunk(
  "contents/getCourseContent",
  async ({ courseId, categoryId }, thunkAPI) => {
    try {
      return await contentFileService.getCourseContent(courseId, categoryId);
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
      .addCase(getCourseContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourseContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.courses = [action.payload];
      })
      .addCase(getCourseContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = contentSlice.actions;
export default contentSlice.reducer;
