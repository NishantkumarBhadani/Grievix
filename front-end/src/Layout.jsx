import React from 'react'
import { Navbar } from './Components'
import { Outlet } from 'react-router-dom'
import {Footer} from './Components'



function Layout() {
  return (
    <>
        <Navbar/>
        <Outlet/>
        <Footer/>

    </>
  )
}

export default Layout