import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"


export var loginApi = createAsyncThunk(
    "login/loginapi",
    async (credentails,{rejectWithValue})=>{
        var response = await fetch("https://dummyjson.com/auth/login",{
            method : "post",
            headers : {
                "content-Type" : "application/json"
            },
            body : JSON.stringify(credentails)
        })
        var data = await response.json()
        if(!response.ok){
            return rejectWithValue(data.message)
        }
        return data

    }
)


var authSlice = createSlice({
    name : "authslice",
    initialState : {
        user : null,
        loading : false,
        error : null

    },
    reducers : {

    },
    extraReducers : (builder)=>{
        builder
        .addCase(loginApi.pending,(state)=>{
            state.loading = true
        })
        .addCase(loginApi.fulfilled,(state,action)=>{
            state.user = action.payload
        })
        .addCase(loginApi.rejected,(state,action)=>{
            state.loading = false,
            state.error  = action.payload
        })
    }
})


export default authSlice.reducer