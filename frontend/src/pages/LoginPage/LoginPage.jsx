import React from 'react'
import Login from '../../Components/Login/Login';
import Navbar from '../../Components/Navbar/Navbar';
const LoginPage = ({url}) => {
  return (
    <div className='login-page'>
      <Navbar />
      <Login url={url}/>
    </div>
  )
}

export default LoginPage;
