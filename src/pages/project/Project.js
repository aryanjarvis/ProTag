import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'
import React, { useState, useEffect } from 'react';
import { SpinnerLoading } from '../../components/spinner';
import HashLoader from "react-spinners/HashLoader";
// components
import ProjectComments from "./ProjectComments"
import ProjectSummary from "./ProjectSummary"

// styles
import './Project.css'

export default function Project() {
  const { id } = useParams()
  const { document, error } = useDocument('projects', id)
  const [loading, setloading] = useState(true);
  useEffect(() => {
    
    setTimeout(() => {
      setloading(false);
    }, 2000);
  }, []);
 
  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }


  return (
    <>
    {loading === true && (
      <div style={{ marginLeft: '820px', fontSize: '20px',marginTop:'300px',justifyContent: 'center', alignItems: 'center', }}>
        <HashLoader color="#8d69f1" aria-label="Loading Spinner"/>
      </div>
    )}
    {loading===false&&(
      <>
       <div className="project-details" style={{ fontFamily: 'Poppins' }}>
      <ProjectSummary project={document} />
      <ProjectComments project={document} />
    </div>
      </>
    )}
   
    </>
  )
}
