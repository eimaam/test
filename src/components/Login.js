import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { HashLoader, BeatLoader } from "react-spinners"
// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..


export default function Login(props) {
  const { logInWithPopUp, navigate, loading, setLoading, error, setError } = useAuth();
  const { setHideNav, userInfo } = useData()


  useEffect(() => {
    // props.showNav(false)
    onAuthStateChanged(auth, data => {
        if(data){
          navigate('../notes')
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
    setLoading(true)
    try{
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((res) => {
          toast.success(`Welcome ${userInfo.username}`)
          navigate('../notes') 
        })
      }
      catch(err){
        if(err.code === 'auth/wrong-password'){
          toast.error('Wrong Password')
          setError('Wrong Password')
        }else if(err.code === 'auth/too-many-requests'){
          toast.error('Too many trials! You will have to reset your password to access this site!')
          setError('Too many trials! You will have to reset your password to access this site!')
        }else if(err.code === 'auth/user-not-found'){
          toast.error('User not found!')
          setError('User not found!')
        }else if(err.code === 'auth/network-request-failed'){
          setError('Sorry...! Something went wrong. Check your internet connection')
        }
        else{
          console.log(err.message)
          toast.error('Retry...')
        }
      }
      setLoading(false)
    }
  
  
//   useEffect(()=>{
//     if(error!==''){
//       setTimeout(()=>{
//           setError('')
//       }, 3000)
//   }
// },[error])

  return (
      <div id='login' onClick={() => setHideNav(true)} data-aos="flip-up" data-aos-easing="ease-in">
      <form action="" onSubmit={handleSubmit}>
        <div>
          <h2>Hello there!👋 </h2>
          <p>Enter your log in credentials to continue</p>
        </div>
        <div>
            <input
            name='email'
            type="email" 
            id='email' 
            placeholder='yourAddress@example.com' 
            value={data.email}
            onChange={handleChange}
            required
            />
        </div>

        <div>
            <input
            name='password'
            type="password" 
            id='password' 
            placeholder='Your Password' 
            value={data.password}
            onChange={handleChange}
            required
            />
        </div>
          {loading && <button><BeatLoader color='#fff'/></button>}
          {!loading && <input type="submit" value="Log in"/>}
          
          <p>Forgot Password? <Link to='/reset' className='error'>RESET NOW</Link></p>
          {/* error message */}
          <p className='error'>{error}</p>
          <p>Don't have an account yet? <Link to="/signup" style={{color: '#ffbd0c'}}>SIGN UP!</Link></p>
          <p>or</p>
          <button onClick={logInWithPopUp} className='flex'>
            Sign up with <FcGoogle />
          </button>
      </form>
      </div>
        )
      }
      