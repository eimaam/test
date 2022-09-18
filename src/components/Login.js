import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'firebase/auth'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PulseLoader } from "react-spinners"


export default function Login() {
  const { userInfo } = useData()
  const { logInWithPopUp, navigate, loading, setLoading } = useAuth();


  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(data){
          navigate('../')
        }
    })
}, [])

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

  // Sign in with Email and Password
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      await setPersistence(auth, browserLocalPersistence)
       
      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((res)=> console.log(res.user))
          toast.success("LOGGED IN")
          return setTimeout(() => {
            navigate('../') 
          }, 3000);
      }
      catch(err){
        toast.error(err.message)
      }
    }
  
  
//   useEffect(()=>{
//     if(loading!==null){
//       setTimeout(()=>{
//           setLoading(false)
//       },5000)
//   }
// },[loading])

  return (
      <div id='login'>
        { loading 
        ? 
        <div>
          <PulseLoader />
        </div>
      :
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="Username">
            Email Address:
          </label>
          <input
          name='email'
          type="email" 
          id='email' 
          placeholder='Email Address' 
          value={data.email}
          onChange={(e) => handleChange(e)}
          />

          <label htmlFor="Passowrd">
            Password:
          </label>
          <input
          name='password'
          type="password" 
          id='password' 
          placeholder='Password' 
          value={data.password}
          onChange={(e) => handleChange(e)}
          />
          <input type="submit" value="LOGIN"/>
          <p>Don't have an account yet? <Link to="/signup">SIGN UP!</Link></p>
          <p>or</p>
          <button onClick={logInWithPopUp}>Sign up with <FaGoogle /></button>
        </form>
      }
        </div>
        )
      }
      