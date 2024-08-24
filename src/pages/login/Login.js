import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'

// styles
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 style={{ fontFamily: 'Poppins' }}>Login:</h2>
      <label>
        <span style={{ fontFamily: 'Poppins' }}>Email:</span>
        <input
          required
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
        />
      </label>
      <label>
        <span style={{ fontFamily: 'Poppins' }}>Password:</span>
        <input 
          required
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
        />
      </label>
      {!isPending && <button className="btn" style={{ fontFamily: 'Poppins' }}>Log in</button>}
      {isPending && <button className="btn" disabled style={{ fontFamily: 'Poppins' }}>loading</button>}
      {error && <div className="error" style={{ fontFamily: 'Poppins' }}>{error}</div>}
    </form>
  )
}
