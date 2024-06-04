import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

// get user from local storage
const user = JSON.parse(localStorage.getItem('usesr'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Register user
export const register = createAsyncThunk('auth/register',async(user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {  
        const message = (error.response && error.reponse.data && error.response.data.message)
        || error.mesage || error.toString()
        return thunkAPI.rejectWithValue(message)//.addCase(register.rejected, (state, action)=>{
    }
})


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        reset: (state) => {

            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(register.rejected, (state, action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
    },
})
export const {reset} = authSlice.actions
export default authSlice.reducer