import { useState } from 'react'
import { Route, Routes, Navigate, useLocation, BrowserRouter as Switch } from "react-router-dom";
import Home from '../components/Home';
import SignUp from '../components/SignUp';
import Login from '../components/Login';
import Header from '../components/Header';
function App() {
  

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </>
  )
}

export default App
