
import * as React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
// import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useHistory } from 'react-router'
import { projectFirestore } from '../../firebase/config'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'



import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

//importing styles
import './Panle.css'

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


const Y_expereince = [
  { value: '1', label: '1 YOE' },
  { value: '2', label: '2 YOE' },
  { value: '3', label: '3 YOE' },
  { value: 'Infinity', label: 'Infinity' },
]


export default function PanelSide() {

  //hooks initialisation
  // const { addDocument, response } = useFirestore('Mentors');
  const { user } = useAuthContext();
  const history = useHistory()
  const { document } = useDocument('users', user.uid);

  //panel bools
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  //form values
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [category, setCategory] = useState('');
  const [specification, setspecification] = useState('');
  const [formError, setFormError] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const original_user = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
      email:user.email
    }

    if (!category) {
      setFormError('Please select a Experience.')
      return
    }
    if (!name) {
      setFormError('Please assign the Name')
      return
    }
    const rating=2;

    //adding and creating collection called mentors with document id as of user uid
    await projectFirestore.collection('Mentors').doc(user.uid).set({
      name,
      original_user,
      experience,
      category,
      specification,
      points: document.points,
      meeting: 0,
      comments: [],
      rating
    })

    await projectFirestore.collection('users').doc(user.uid).update({
      mentor_ship: true,
    })



    const firestore = firebase.firestore();
    //updating the points with 80EXP
    firestore
      .collection('users')
      .doc(user.uid)
      .update({
        points: firebase.firestore.FieldValue.increment(80)
      })
      .then(() => {
        console.log('User points updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user points:', error);
      });

   



    // await addDocument(mentor);
    if (!formError) {
     
        history.push('/mentor');
        setName('');
        setExperience('');
        setCategory('');
        setspecification('');
        setFormError(null);
        dismissPanel();
    
    }
  }

  return (
    <>
      <div>
        <DefaultButton style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontFamily: 'Poppins', fontSize: '16px', borderRadius: '4px', padding: '10px 20px' }}
          text="Join our Superstars" onClick={openPanel} />
        <Panel
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          isFooterAtBottom={true}
        >
          {/* inside panel content */}
          <>
            <div className="create-form" style={{ fontFamily: 'Poppins' }}>
              <h2 className="page-title">Add Yourself as a Mentor</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  <span style={{ fontFamily: 'Poppins' }}>Assasin Name:</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </label>
                <label>
                  <span style={{ fontFamily: 'Poppins' }}>Experience</span>
                  <textarea
                    required
                    onChange={(e) => setExperience(e.target.value)}
                    value={experience}
                  ></textarea>
                </label>
                <label>
                  <span style={{ fontFamily: 'Poppins' }}>Specification</span>
                  <input
                    required
                    type="text"
                    onChange={(e) => setspecification(e.target.value)}
                    value={specification}
                  />
                </label>
                <label>
                  <span style={{ fontFamily: 'Poppins' }}>For How Long Your hand Doing This:</span>
                  <Select
                    value={category}
                    onChange={(option) => setCategory(option)}
                    options={Y_expereince}
                  />
                </label>
                <button className="btn" onClick={handleSubmit} style={{ margin: '10px', fontFamily: 'Poppins' }}>Lets Go!</button>
                <button className="btn" onClick={dismissPanel} style={{ margin: '10px', fontFamily: 'Poppins' }}>Still Noob</button>
                {formError && <p className="error">{formError}</p>}
              </form>
            </div>
          </>
        </Panel>
     

      </div>
     
    </>
  );
};