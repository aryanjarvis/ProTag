import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { NavLink } from 'react-router-dom';

// styles & images
import './Navbar.css'
import Temple from '../assets/temple.svg'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="protag logo" />
          <span>ProTag</span>
        </li>

        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}

        {user && (
          <>
            <li>
              <NavLink exact to="/resource" activeClassName="active" style={{ fontFamily: 'Poppins',marginRight:'20px' }}>
                Resource
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/codepair" activeClassName="active" style={{ fontFamily: 'Poppins',marginRight:'20px' }}>
                CodePair
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/mentor" activeClassName="active" style={{ fontFamily: 'Poppins',marginRight:'20px' }}>
                Mentor
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/project_home" activeClassName="active" style={{ fontFamily: 'Poppins',marginRight:'20px' }}>
                Projects
              </NavLink>
            </li>

            <li>
              {!isPending && <button className="btn" onClick={logout}>Logout</button>}
              {isPending && <button className="btn" disabled>Logging out...</button>}
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
