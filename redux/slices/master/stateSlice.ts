import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
    stateList:[],
    countryList:[],
    HdrTable:null,
    statusList:[],
    selectedState:{},
    editOrCreateList:null,
    isLoading:false,
    error :'',
    createTranstatus:null,
    stateDeletedList:null,
    stateUpdateList:null,
    viewList:false
}
const BASE_URL = "https://localhost:5001/State/"


//for get state value
export const getStateListFromServer = createAsyncThunk(
    "State/getStateListFromServer",
    async(data :any,{rejectWithValue})=>{
        const options ={
            method :"POST",
            headers: {
                "content-type": "application/json",
              },
            body :JSON.stringify(data)
            
        }
        const response = await fetch(`${BASE_URL}SearchInitialize`,options)
        if(response.ok){
            const jsonResponce =await response.json()
            return jsonResponce
        }else {
            return rejectWithValue({error:"No Data Found"})
        }
    }
)
export const deleteStateListFromServer = createAsyncThunk(
    "State/deleteStateListFromServer",
    async(data :any,{rejectWithValue})=>{
        const options ={
            method :"POST",
            headers: {
                "content-type": "application/json",
              },
            body :JSON.stringify(data)
            
        }
        const response = await fetch(`${BASE_URL}ChangeStatus`,options)
        if(response.ok){
            const jsonResponce =await response.json()
            return jsonResponce
        }else {
            return rejectWithValue({error:"Data is not deleted"})
        }
    }
)
export const addStateListFromServer = createAsyncThunk(
    "State/addStateListFromServer",
    async(data :any,{rejectWithValue})=>{
        const options ={
            method :"POST",
            headers: {
                "content-type": "application/json",
              },
            body :JSON.stringify(data)
            
        }
        const response = await fetch(`${BASE_URL}Create`,options)
        if(response.ok){
            const jsonResponce =await response.json()
            return jsonResponce
        }else {
            return rejectWithValue({error:"Data Not Added"})
        }
    }
)
export const updateStateListFromServer = createAsyncThunk(
    "State/updateStateListFromServer",
    async(data :any,{rejectWithValue})=>{
        const options ={
            method :"POST",
            headers: {
                "content-type": "application/json",
              },
            body :JSON.stringify(data)
            
        }
        const response = await fetch(`${BASE_URL}Update`,options)
        if(response.ok){
            const jsonResponce =await response.json()
            return jsonResponce
        }else {
            return rejectWithValue({error:"Data Not Updated"})
        }
    }
)
// export const openEditOrCreateList =(no :any)=>{
//     let editOrCreateList=no
// }

export const initialStateValue = createAsyncThunk(
    "State/initialStateValue",
    async(data :any,{rejectWithValue})=>{
        const options ={
            method :"POST",
            headers: {
                "content-type": "application/json",
              },
            body :JSON.stringify(data)
            
        }
        const response = await fetch(`${BASE_URL}CreateInitialize`,options)
        if(response.ok){
            const jsonResponce =await response.json()
            return jsonResponce
        }else {
            return rejectWithValue({error:"Data Not Added"})
        }
    }
)

const stateSlice = createSlice({
    name:'stateSlice',
    initialState,
    reducers: {
        openEditOrCreateList:(state,action) => {
            state.editOrCreateList=action.payload.data
            state.viewList=action.payload.view
        },
        // removeTaskFromList:(state,action) => {
        //     state.stateList = state.stateList.filter((task) => task.id !== action.payload.id)
        // },
        // updateTaskInList:(state,action) => {
        //     state.stateList = state.stateList.map((task) => task.id === action.payload.id ? action.payload : task )
        // },
        // setSelectedTask:(state,action) => {
        //     state.stateList = action.payload
        // }

    },
    extraReducers:(builder) =>{
        builder
           
            .addCase(getStateListFromServer.pending,(state)=>{
                state.isLoading =true
            })
            .addCase(getStateListFromServer.fulfilled,(state,action)=>{
                state.isLoading =false
                state.error=''
                state.stateList=action.payload.StateList
            })
            .addCase(getStateListFromServer.rejected,(state,action :any)=>{
                state.isLoading =false
                // state.error=action.error
            })
            .addCase(addStateListFromServer.pending,(state)=>{
                state.isLoading =true
            })
            .addCase(addStateListFromServer.fulfilled,(state,action)=>{
                state.isLoading =false
                state.createTranstatus=action.payload.transtatus
                state.error=''
            })
            .addCase(addStateListFromServer.rejected,(state,action :any)=>{
                state.isLoading =false
                // state.error=action.payload.error
            })
            .addCase(updateStateListFromServer.pending,(state)=>{
                state.isLoading =true
            })
            .addCase(updateStateListFromServer.fulfilled,(state,action)=>{
                state.isLoading =false
                state.stateUpdateList=action.payload.transtatus
                state.error=''
            })
            .addCase(updateStateListFromServer.rejected,(state,action :any)=>{
                state.isLoading =false
                // state.error=action.payload.error
            })
            .addCase(initialStateValue.pending,(state)=>{
                state.isLoading =true
            })
            .addCase(initialStateValue.fulfilled,(state,action)=>{
                state.isLoading =false
                state.error=''
                state.statusList=action.payload.StatusList
                state.countryList=action.payload.CountryList
                state.HdrTable=action.payload.HdrTable
            })
            .addCase(initialStateValue.rejected,(state,action :any)=>{
                state.isLoading =false
                // state.error=action.payload.error
            })
            .addCase(deleteStateListFromServer.pending,(state)=>{
                state.isLoading =true
            })
            .addCase(deleteStateListFromServer.fulfilled,(state,action)=>{
                state.isLoading =false
                state.error=''
                state.stateDeletedList=action.payload.transtatus
            })
            .addCase(deleteStateListFromServer.rejected,(state,action :any)=>{
                state.isLoading =false
                // state.error=action.payload.error
            })
    }

})

export const {openEditOrCreateList} = stateSlice.actions

export default stateSlice.reducer