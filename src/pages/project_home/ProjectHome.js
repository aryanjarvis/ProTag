import * as React from 'react';
import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

import { useDocument } from '../../hooks/useDocument'
// import { useFirestore } from '../../hooks/useFirestore'


//components
import ProjectAdd from './Project_add.js'
import ProjectHomeFilter from './Project_homefilter'
import ProjectHomeList from '../../components/ProjectHomelist'


export default function ProjectHome(){
    //hooks
    const {user}= useAuthContext();
    const {document}=useDocument('users',user.uid);
    const { documents} = useCollection('Project_home')
    const [filter, setFilter] = useState('all')

    const check=document?.project_add;

    const changeFilter = (newFilter) => {
      setFilter(newFilter)
    }
    // const filterList = ['all', 'Sales', 'Engineering', 'Trading', 'LifeHacks', 'Management', 'OutOfBox']
    const projects = documents ? documents.filter(document => {
      switch(filter) {
        case 'All':
          return true
        case 'Sales':
        case 'Engineering':
        case 'Trading':
        case 'LifeHacks':
          case 'OutOfBox':
        case 'Management':
          console.log(document.industry, filter)
          return document.industry.value === filter
        default:
          return true
      }
    }) : null

    return(
        <>
        <h2 className="page-title" style={{margin:'0 5px 8px 0', fontFamily: 'Poppins'}}>Projects</h2>
        <br></br>
          {!check &&(
          <ProjectAdd/>
          )}
          <br></br>
          {documents && <ProjectHomeFilter changeFilter={changeFilter} />}
          {projects && <ProjectHomeList projects={projects} />}
        </>
    )
}