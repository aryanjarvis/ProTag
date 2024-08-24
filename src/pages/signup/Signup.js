import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const { signup, isPending, error } = useSignup()
 

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('🎉 Hey! Welcome aboard ! As a warm welcome gift, we have credited your account with 50 EXP ! 🚀', {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    console.log("Succesfully Submitted signup toast");

    setTimeout(() => {
      signup(email, password, displayName, thumbnail) 
    }, 4020); // 6 seconds
   
  }

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]
    console.log(selected)

    if (!selected) {
      setThumbnailError('Please select a file')
      return
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image')
      return
    }
    if (selected.size > 10000000) {
      setThumbnailError('Image file size must be less than 1000kb')
      return
    }

    setThumbnailError(null)
    setThumbnail(selected)
    console.log('thumbnail updated')
  }
 

  return (
    <>
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 style={{fontFamily: 'Poppins'}}>Sign Up</h2>
      <label>
        <span style={{fontFamily: 'Poppins'}}>Email:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span style={{fontFamily: 'Poppins'}}>Password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span style={{fontFamily: 'Poppins'}}>Display Name:</span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span style={{fontFamily: 'Poppins'}}>Profile Thumbnail:</span>
        <input
          required
          type="file"
          onChange={handleFileChange}
        />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>

      
      

      {!isPending && <button className="btn" style={{fontFamily: 'Poppins'}}>Sign up</button>}
      {isPending && <button className="btn" disabled style={{fontFamily: 'Poppins'}}>loading</button>}
      {error && <div className="error">{error}</div>}
    </form>
    <ToastContainer style={{ width: "900px",fontFamily:'Poppins' }} />
    </>
  )
}
