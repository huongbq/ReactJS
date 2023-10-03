import React, { useEffect, useState } from 'react'
import '../App.scss'
import { toast } from 'react-toastify';
import { loginApi } from '../Services/UserService';
import { useNavigate } from 'react-router-dom';

export default function FormLogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      navigate('/')
    }
  }, [])
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/Password is required")
      return
    }
    setLoading(true)
    let res = await loginApi(email, password)
    if (res && res.token) {
      localStorage.setItem('token', res.token)
      navigate('/')
    } else {
      if (res && res.status === 400) {
        toast.error(res.data.error)
      }
    }
    setLoading(false)
  }

  return (
    <div className='login-container col-12 col-sm-4'>
      <h2>Log in</h2>
      <div className="text">
        <span>Email or username</span>
        <span>( eve.holt@reqres.in )</span>
      </div>
      <input
        className='input'
        type="text"
        placeholder='Email or username...'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className='field-password'>
        <input
          className='input'
          type={isShowPassword === true ? "type" : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password...'
        />
        <i
          className={isShowPassword === true ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}
          onClick={() => setIsShowPassword(!isShowPassword)}
        ></i>
      </div>
      <p>Forgot Password?</p>
      <button
        className={email && password ? 'active' : ''}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {loading && <i className="fas fa-circle-notch fa-spin"></i>} &nbsp;Log in
      </button>
      <div className='back'><i className="fa-solid fa-angles-left"></i> Go Back</div>
    </div>
  )
}
