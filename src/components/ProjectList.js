import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'

// styles
import './ProjectList.css'

export default function ProjectList({ projects }) {
  console.log(projects)

  return (
    <div className="project-list" style={{ fontFamily: 'Poppins' }}>
      {projects.length === 0 &&   <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20vh', // Set the desired height of the container
      }}
    >
      <p style={{ textAlign: 'center',fontSize:'20px' }}>
      Sorry! You are neither a Part or Owner of any Project
      </p>
    </div>}
      {projects.map(project => (
        <Link to={`/projects/${project.id}`} key={project.id}>
          <h4 style={{ fontFamily: 'Poppins' }}>{project.name}</h4>
          <p style={{ fontFamily: 'Poppins' }}>Due by
            
             {project.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to" style={{ fontFamily: 'Poppins' }}>
            <p style={{ fontFamily: 'Poppins' }}><strong>Assigned to:</strong></p>
            <ul>
              {project.assignedUsersList.map(user => (
                <li key={user.photoURL}>
                  <Avatar src={user.photoURL} />
                
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  )
}
