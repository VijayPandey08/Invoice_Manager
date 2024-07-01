import React from 'react';
import '../Components/Login.css'
import { useState } from 'react';
import {auth} from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login =() => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(email, password);
    signInWithEmailAndPassword(auth,email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      console.log(user);
      localStorage.setItem('cNAME',user.displayName);
      localStorage.setItem('cEMAIL',user.email);
      localStorage.setItem('photoURL',user.photoURL);
      localStorage.setItem('uid',user.uid);
      localStorage.setItem('cPHONE',user.phoneNumber);
      navigate('/dashboard');
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  return (<>
  <div className='mybody'>
    <div className="wrapper">
      <form  onSubmit={submitHandler} action="">
        <h1>Login</h1>
        <div className="input-box">
        <input onChange={(e) => { setEmail(e.target.value); }} type="text" placeholder="Email" required />
          <i className='bx bxs-user'></i>
        </div>
        <div className="input-box">
        <input onChange={(e) => { setPassword(e.target.value); }} type="password" placeholder="Password" required />
          <i className='bx bxs-lock-alt'></i>
        </div>
        {/* <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href="#">Forgot Password?</a>
        </div> */}
        <button type="submit" className="btn"> {loading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}  Login</button>
        <div className="register-link">
          <p>Dont have an account? <a href='/register'>Register</a></p>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default Login;
