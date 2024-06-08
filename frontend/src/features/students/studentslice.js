import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import studentService from './studentservie'

const initialState = {
    students: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// get students
export const getStudents = createAsyncThunk('students/getStudents',async (courseid,thunkAPI) =>{
    console.log('studentslice ')
    try {
        return await studentService.getStudents(courseid)
    } catch (error) {
        console.log('studentslice catch error '+error+ error.message + error.response)
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

// register student
export const registerStudents = createAsyncThunk('students/registerStudents',async(courseid,thunkAPI) =>{
    try {
        return await studentService.registerStudents(courseid)
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
}) 

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getStudents.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(getStudents.fulfilled,(state,action) => {
            state.isLoading = false
            state.isSuccess = true
            state.students = action.payload
        })
        .addCase(getStudents.rejected,(state,action) => {
            console.log('getStudents rejected')
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(registerStudents.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(registerStudents.fulfilled,(state,action) => {
            state.isLoading = false
            state.isSuccess = true
            state.students = action.payload
        })
        .addCase(registerStudents.rejected,(state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = studentSlice.actions
export default studentSlice.reducer
