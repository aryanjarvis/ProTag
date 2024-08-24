import { useCollection } from '../hooks/useCollection'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDocument } from '../hooks/useDocument'

import { useEffect, useState } from 'react';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
// components
import Avatar from './Avatar'

// styles
import './OnlineUsers.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faExplosion } from '@fortawesome/free-solid-svg-icons';
const firebaseConfig = {
  apiKey: "AIzaSyB4DdltYjD_lfYmW5HuBOjdLUvPnI580DQ",
  authDomain: "protag-f9d58.firebaseapp.com",
  projectId: "protag-f9d58",
  storageBucket: "protag-f9d58.appspot.com",
  messagingSenderId: "824602613440",
  appId: "1:824602613440:web:c0c20f897491fd442abf25"
};

if (!firebase.apps.length) {
  // Initialize Firebase here
  firebase.initializeApp(firebaseConfig);
}


export default function OnlineUsers() {
  const { isPending, error, documents } = useCollection('users')
  
  const [filteredData, setFilteredData] = useState([]);
  const db = firebase.firestore();
  const { user } = useAuthContext()
  const { document } = useDocument('users', user.uid);  

  const project_name = document?.project_joined;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await db.collection('Project_home').where('Title', '==', project_name).get();

        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const documentData = documentSnapshot.data();
          
          const membersArray = [...documentData.members, documentData.projectOwner.id];
          console.log(membersArray);

          // Filter data from another collection based on member IDs
          const filteredData = await fetchFilteredData(membersArray);
          setFilteredData(filteredData);
        } else {
          console.log('No document found with the given Title value.');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchMembers();
  }, [project_name]);

  const fetchFilteredData = async (memberIds) => {
    try {
      const filteredData = [];

      for (const memberId of memberIds) {
        const memberDocRef = db.collection('users').doc(memberId);
        const memberDocSnapshot = await memberDocRef.get();

        if (memberDocSnapshot.exists) {
          const memberData = memberDocSnapshot.data();
          filteredData.push(memberData);
        }
      }

      return filteredData;
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      return [];
    }
  };

  // Render the filteredData as needed
  console.log("the Filtered Data is ",filteredData);

  // Rest of your component code


  const myStyle = {
    color: 'var(--primary-color)',
    fontSize: '16px',
   marginRight:'10px'
  };

  return (
    <div className="user-list">
      <h2 style={{ fontFamily: 'Poppins' }}>Buddies</h2>
      {isPending && <div>Loading users...</div>}
      {error && <div>{error}</div>}
      {filteredData && filteredData.map(user => (
        <div key={user.id} className="user-list-item">
          {user.online && <span className="online-user"></span>}
          <span style={myStyle}>{user.points} <FontAwesomeIcon icon={faExplosion} style={{ color:'#514100',fontSize: '11px', marginLeft: '5px' }} /></span>
          <span style={{ fontFamily: 'Poppins' }}>{user.displayName}</span>
          <Avatar src={user.photoURL} />
        </div>
      ))}
    </div>
  )
}
