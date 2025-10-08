import Navbar from "./Components/Navbar/Navbar"
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Layout from "./Layout"
import { LoginForm,SignUpForm,ComplaintForm,MyComplaints,ComplaintStatus,AdminComplaints} from "./Components"
import {Provider} from 'react-redux'
import { PersistGate } from "redux-persist/integration/react"
import { store,persistor } from "./redux/app/store.js"



function App() {
  const router=createBrowserRouter([
    {
      path:'/',
      element:<Layout/>,
      children:[
        {
          path:"login",
          element:<LoginForm/>
        },
        {
          path:"signUp",
          element:<SignUpForm/>
        },
        {
          path:"complaintForm",
          element:<ComplaintForm/>
        },
        {
          path:"mycomplaints",
          element:<MyComplaints/>
        },
        {
          path:"complaints/:id/details",
          element:<ComplaintStatus/>
        },
        {
          path:"admin/complaints",
          element:<AdminComplaints/>
        }
      ]
    }
  ])
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  )
}

export default App
