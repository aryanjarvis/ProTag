import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router'
import { useDocument } from '../../hooks/useDocument'
import Select from 'react-select'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
// styles
import './Create.css'

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

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

export default function Create() {
  const history = useHistory()
  const { addDocument, response } = useFirestore('projects')
  const { user } = useAuthContext()
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])

  const { document, error } = useDocument('users', user.uid);  

  const check = document?.project_joined;

  console.log("This is inside check",check)

  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  // create user values for react-select
  useEffect(() => {
    if (documents) {
      setUsers(documents.map(user => {
        return { value: { ...user, id: user.id }, label: user.displayName }
      }))
    }
  }, [documents])

  const handlelinkclick = () => {
    history.push('/');
  }

  const handleSubmit = async (e) => {

    if (check==='') {
      window.alert("Sorry "+`${user.displayName}` + ", Please Join a Project to Request the following feature");
      handlelinkclick();
    }

    else {
      e.preventDefault()
      setFormError(null)

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

      if (!category) {
        setFormError('Please select a project category.')
        return
      }
      if (assignedUsers.length < 1) {
        setFormError('Please assign the project to at least 1 user')
        return
      }

      const assignedUsersList = assignedUsers.map(u => {
        return {
          displayName: u.value.displayName,
          photoURL: u.value.photoURL,
          id: u.value.id
        }
      })
      const createdBy = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        id: user.uid
      }

      const mainproject_name = check;

      const project = {
        name,
        details,
        assignedUsersList,
        createdBy,
        category: category.value,
        dueDate: timestamp.fromDate(new Date(dueDate)),
        comments: [],
        mainproject_name,
      }

      await addDocument(project)
      if (!response.error) {
        setTimeout(() => {
          history.push('/');
        }, 4000); // Delay of 4 seconds
      }
    }
  }

  return (
    <div className="create-form">
      <h2 className="page-title" style={{ fontFamily: 'Poppins' }}>Create a new Sprint</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span style={{ fontFamily: 'Poppins' }}>Project name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span style={{ fontFamily: 'Poppins' }}>Project Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span style={{ fontFamily: 'Poppins' }} >Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span style={{ fontFamily: 'Poppins' }}>Project category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span style={{ fontFamily: 'Poppins' }}>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>

        {/* {user.project_joined&&( */}
        <button className="btn" style={{ fontFamily: 'Poppins' }}>Add Project</button>
        {/* ) }       */}

        {formError && <p className="error">{formError}</p>}
      </form>
      <ToastContainer style={{ width: "600px", fontFamily: 'Poppins' }} />

    </div>
  )
}
