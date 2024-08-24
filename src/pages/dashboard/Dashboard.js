import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDocument } from '../../hooks/useDocument'

// components
import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'

// styles
import './Dashboard.css'



export default function Dashboard() {
  const { user } = useAuthContext()
  const { documents, error } = useCollection('projects')
  const [filter, setFilter] = useState('all')
  const { document} = useDocument('users', user.uid);  


  const main_project_name = document?.project_joined;


  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }
  
 //filtering based on which project user has joined 
  const projects = documents ? documents.filter(document => {
    switch(filter) {
      case 'all':
        return document.mainproject_name ===  main_project_name;
      case 'mine':
        let assignedToMe = false;
        document.assignedUsersList.forEach(u => {
          if(u.id === user.uid) {
            assignedToMe = true;
          }
        });
        return assignedToMe && document.mainproject_name ===  main_project_name;
      case 'development':
      case 'design':
      case 'sales':
      case 'marketing':
        console.log(document.category, filter);
        return document.category === filter && document.mainproject_name ===  main_project_name;
      default:
        return true;
    }
  }) : null;
  

  return (
    <div>
      
      
      <h2 className="page-title" style={{ fontFamily: 'Poppins' }}>Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && <ProjectFilter changeFilter={changeFilter} />}
      {projects && <ProjectList projects={projects} />}

     
      
    </div>
  )
}
