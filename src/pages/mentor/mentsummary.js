
import { Card, Avatar } from 'antd';
import { useFirestore } from "../../hooks/useFirestore"
import { useHistory } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectFirestore } from '../../firebase/config'

import './mentorprofile.css'

export default function Mentsummary({ mentor }) {
  const { deleteDocument } = useFirestore('Mentors')
  const { user } = useAuthContext()
  const history = useHistory()
  const { Meta } = Card;


  //deleting the mentor of yours
  const handleClick = async () => {
    deleteDocument(mentor.id)
    await projectFirestore.collection('users').doc(user.uid).update({
      mentor_ship: false,
    })
    history.push('/mentor')
  }
  console.log("inside mentor summary")
  console.log(mentor);

  return (

    <div style={{ gap: '20px',fontFamily: 'Poppins' }}>
      <Card
        hoverable
        style={{
          width: 390,
          background: 'linear-gradient(to bottom, #f5f5f6, #dcdcdc)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          marginBottom: '20px',
          fontFamily: 'Poppins'
        }}
        cover={
          <Avatar
            size={150}
            src={mentor.original_user.photoURL}
            alt="Mentor"
            style={{
              textDecoration: 'none',
              margin: 'auto',
              marginTop: '10px',
              marginBottom: '10px',
              display: 'block',
              objectFit: 'cover',

            }}
            polygon
          />
        }
      >
        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px',fontFamily: 'Poppins' }}>
          <Meta
            title={mentor.name}
            description={mentor.specification}
            style={{ fontSize: '32px', lineHeight: '1.2' }}
          />
        </div>
        <p style={{ marginTop: '12px', fontSize: '16px',fontFamily: 'Poppins' }}>{mentor.experience}</p>
      </Card>
      {user.uid === mentor.id && (
        <button className="btn" onClick={handleClick} style={{ fontSize: '22px',fontFamily: 'Poppins',padding:'15px',fontWeight:'25px' }}>
        L a z e
        </button>
      )}
    </div>


  )
}