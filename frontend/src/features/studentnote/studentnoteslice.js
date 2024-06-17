import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import studentNoteService from './studentnoteservice'

const initialState = {
    studentnotes: {
        _id: "",
        notes: ""
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const addNote = createAsyncThunk('studentnote/addNote',async (noteData,thunkAPI) =>{
    try {
        return await studentNoteService.addNote(noteData)
    } catch (error) {
        const message = error?.response?.data?.message || "";
     return thunkAPI.rejectWithValue(message)
    }
})

export const updateNote = createAsyncThunk('studentnote/updateNote',async ({noteid,subnoteid,notetext},thunkAPI) =>{
    try {
        return await studentNoteService.updateNote(noteid,subnoteid,notetext)
    } catch (error) {
        const message = error?.response?.data?.message || "";
     return thunkAPI.rejectWithValue(message)
    }
})

// export const shareNote = createAsyncThunk('studentnote/shareNote',async (noteData,thunkAPI) =>{
//     try {
//         return await studentNoteService.shareNote(noteData)
//     } catch (error) {
//         const message = error?.response?.data?.message || "";
//      return thunkAPI.rejectWithValue(message)
//     }
// })

export const getNotes = createAsyncThunk('studentnote/getNotes',async ({user,course,file,activity},thunkAPI) =>{
    try {
        return await studentNoteService.getNotes(user,course,file,activity)
    } catch (error) {
        const message = error?.response?.data?.message || "";
      return thunkAPI.rejectWithValue(message)
    }
})

export const studentNoteSlice = createSlice({
    name: 'studentNote',
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers: (builder) =>{
        builder
        .addCase(addNote.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(addNote.fulfilled,(state,action) => {
            state.isLoading = false
            state.isSuccess = true
            state.studentnotes = action.payload
        })
        .addCase(addNote.rejected,(state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getNotes.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(getNotes.fulfilled,(state,action) => {
            state.isLoading = false
            state.isSuccess = true
            state.studentnotes = action.payload
        })
        .addCase(getNotes.rejected,(state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateNote.pending, (state) =>{
            state.isLoading = true
        })
        .addCase(updateNote.fulfilled,(state,action) => {
            state.isLoading = false
            state.isSuccess = true
            state.studentnotes = action.payload
        })
        .addCase(updateNote.rejected,(state,action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})


export const {reset} = studentNoteSlice.actions
export default studentNoteSlice.reducer