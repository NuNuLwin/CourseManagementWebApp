import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice'; 
import studentReducer from '../features/students/studentslice';
import studentNoteReducer from '../features/studentnote/studentnoteslice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    students:studentReducer,
    studentNotes: studentNoteReducer
  },
});
