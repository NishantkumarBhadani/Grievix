import Navbar from "./Components/Navbar/Navbar"
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Layout from "./Layout"
import { LoginForm,SignUpForm } from "./Components"



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
        }
      ]
    }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
