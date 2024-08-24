import { NavLink } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

// components
import Avatar from "./Avatar"

// styles & images
import "./Sidebar.css"
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'


export default function Sidebar() {
  const { user } = useAuthContext()

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          <p style={{fontSize:'25px', fontFamily: 'Poppins'}}>Hey {user.displayName}</p>  
        </div>  
        <nav className="links">
          <ul>
          <NavLink to="/profile">
          <FontAwesomeIcon icon={faUser} className="fa-light" style={{marginRight:'12px',marginLeft:'4px'}} />
                <span style={{ fontFamily: 'Poppins'}}>My Profile</span>
              </NavLink>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                <span style={{ fontFamily: 'Poppins'}}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="add project icon" />
                <span style={{ fontFamily: 'Poppins'}}>New Sprint</span>
              </NavLink>
            </li>
            
          </ul>
        </nav>
      </div>
    </div>
  )
}
