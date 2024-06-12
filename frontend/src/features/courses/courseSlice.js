import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "./courseService";

const initialState = {
  courses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new course
export const createCourse = createAsyncThunk(
  "courses/create",
  async (courseData, thunkAPI) => {
    try {
      return await courseService.createCourse(courseData);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get courses by instructor id
export const getCoursesByInstructorId = createAsyncThunk(
  "courses/getCoursesByInstructorId",
  async ({ instructorId, courseStatus }, thunkAPI) => {
    try {
      return await courseService.getCoursesByInstructorId(
        instructorId,
        courseStatus
      );
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get courses by student id
export const getCoursesByStudentId = createAsyncThunk(
  "courses/getCoursesByStudentId",
  async ({ studentId, courseStatus }, thunkAPI) => {
    try {
      return await courseService.getCoursesByStudentId(studentId, courseStatus);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get course by course id
export const getCourseByCourseId = createAsyncThunk(
  "courses/getCourseByCourseId",
  async (courseId, thunkAPI) => {
    try {
      return await courseService.getCourseByCourseId(courseId);
    } catch (error) {
      const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getCoursesByInstructorId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoursesByInstructorId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = action.payload;
      })
      .addCase(getCoursesByInstructorId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getCoursesByStudentId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoursesByStudentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = action.payload;
      })
      .addCase(getCoursesByStudentId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getCourseByCourseId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourseByCourseId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = [action.payload];
      })
      .addCase(getCourseByCourseId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
