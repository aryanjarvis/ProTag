import Avatar from "../../components/Avatar"
import { useFirestore } from "../../hooks/useFirestore"
import { useHistory } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const firebaseConfig = {
    apiKey: "AIzaSyB4DdltYjD_lfYmW5HuBOjdLUvPnI580DQ",
    authDomain: "protag-f9d58.firebaseapp.com",
    projectId: "protag-f9d58",
    storageBucket: "protag-f9d58.appspot.com",
    messagingSenderId: "824602613440",
    appId: "1:824602613440:web:c0c20f897491fd442abf25"
};

// init firebase
if (!firebase.apps.length) {
    // Initialize Firebase here
    firebase.initializeApp(firebaseConfig);
}

export default function ProjectSummary({ project }) {
  const { deleteDocument } = useFirestore('projects')
  const { user } = useAuthContext()
  const history = useHistory()

  const handleClick = () => {
    deleteDocument(project.id)

    const firestore = firebase.firestore();
    //updating the points with 100EXP
    firestore
        .collection('users')
        .doc(user.uid)
        .update({
            points: firebase.firestore.FieldValue.increment(20)
        })
        .then(() => {
            console.log('User points updated successfully');
        })
        .catch((error) => {
            console.error('Error updating user points:', error);
        });

    toast.success(`We have credited your account with 20 EXP! 💰`, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  });
  
    history.push('/');
 
  }

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title" style={{ fontFamily: 'Poppins' }}>{project.name}</h2>
        <p className="due-date" style={{ fontFamily: 'Poppins' }}>
          Project due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className="details" style={{ fontFamily: 'Poppins' }}>
          {project.details}
        </p>
        <h4 style={{ fontFamily: 'Poppins' }}>Project assigned to:</h4>
        <div className="assigned-users">
          {project.assignedUsersList.map(user => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>

      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick} style={{marginTop:'20px'}}>Mark as Complete</button>
      )}

    </div>
  )
}