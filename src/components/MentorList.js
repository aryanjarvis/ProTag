import { Link } from 'react-router-dom'
// // import Avatar from '../components/Avatar'
import { Card, Avatar } from 'antd';



// styles
import './MentorList.css';

export default function MentorList({ mentors }) {
    const { Meta } = Card;



    console.log("we iinside mentos ")
    if (mentors.length > 0)
        console.log(mentors[0].original_user.id)

    return (
        <div style={{ display: 'flex', fontSize: '60px', flexWrap: 'wrap', gap: '90px', fontFamily: 'Poppins', marginTop: '20px', padding: '20px' }}>
        {mentors.length === 0 && <p>No Mentors yet!</p>}
        {mentors.map((mentor) => (
          <Link style={{ textDecoration: 'none' }} to={`/mentors/${mentor.id}`} key={mentor.id}>
            <Card
              hoverable
              style={{
                width: 390,
                height: '100%', // Set a fixed height for the cards
                background: 'linear-gradient(to bottom, #f5f5f6, #dcdcdc)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontFamily: 'Poppins'
              }}
              cover={
                <Avatar
                  size={150}
                  src={mentor.original_user.photoURL}
                  alt="Mentor"
                  style={{ textDecoration: 'none', margin: 'auto', marginTop: '18px', marginBottom: '10px', display: 'block', objectFit: 'cover' }}
                  polygon
                />
              }
            >
              <div style={{ padding: '7px 0', fontFamily: 'Poppins', height: '100%' }}> {/* Set a fixed height for the card content */}
                <b style={{ fontSize: '42px' }}>
                  <Meta title={mentor.name} />
                </b>
                <b style={{ fontSize: '14px', fontFamily: 'Poppins' }}>
                  "{mentor.specification} ({mentor.category.label})"
                </b>
                <p style={{ fontSize: '14.5px', fontFamily: 'Poppins' }}>{mentor.experience}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
    )
}
