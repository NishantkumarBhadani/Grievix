import Navbar from "./Components/Navbar/Navbar"
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Layout from "./Layout"
import { LoginForm,SignUpForm,ComplaintForm } from "./Components"
import {Provider} from 'react-redux'
import store from "./redux/app/store"



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
        }
      ]
    }
  ])
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  )
}

export default App
