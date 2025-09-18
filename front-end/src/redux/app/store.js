import  {configureStore} from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice.js"
import adminReducer from "../Features/adminSlice.js"

const store=configureStore({
    reducer:{
        auth:authReducer,
        admin:adminReducer
    }
})

export default store;