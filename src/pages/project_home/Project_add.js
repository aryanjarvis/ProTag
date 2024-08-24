
import * as React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
// import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useHistory } from 'react-router'
import { projectFirestore } from '../../firebase/config'
import Select from 'react-select'

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



const Pindustry = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Trading', label: 'Trading' },
    { value: 'LifeHacks', label: 'LifeHacks' },
    { value: 'Management', label: 'Management' },
    { value: 'OutOfBox', label: 'Out Of Box' },
]



export default function ProjectAdd() {

    const { user } = useAuthContext();
    const history = useHistory()
    const db = firebase.firestore();

    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

    //Project addition variables
    
    const [Title, settitle] = useState('');
    const [industry, setindustry] = useState('');
    const [description, setdescription] = useState('');
    const [formError, setFormError] = useState(null)
    const [instruction, setinstruction] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        const projectOwner = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
        }
           
        if (!industry) {
            setFormError('Please Tell us something more about industry')
            return
        }
        if (!Title) {
            setFormError('Please assign the Title')
            return
        }
        const randomDocId = projectFirestore.collection('Project_home').doc().id;
        const members=[];

        const documentRef2 = db.collection('users').doc(user.uid);
        const fieldToUpdate2 = 'project_joined';
        documentRef2.update({
            [fieldToUpdate2]: Title,
           
        })

        //adding and creating collection called mentors with document id as of user uid
        await projectFirestore.collection('Project_home').doc(randomDocId).set({
            Title,
            members,
            industry,
            description,
            instruction,
            comments: [],
            projectOwner,         
        })
        // await projectFirestore.collection('Project_home').add({
        //     Title,
        //     industry,
        //     description,
        //     instruction,
        //     comments: [],
        //     projectOwner
        // })

        await projectFirestore.collection('users').doc(user.uid).update({
            project_add: true,
        })
        const firestore = firebase.firestore();
        //updating the points with 100EXP
        firestore
            .collection('users')
            .doc(user.uid)
            .update({
                points: firebase.firestore.FieldValue.increment(100)
            })
            .then(() => {
                console.log('User points updated successfully');
            })
            .catch((error) => {
                console.error('Error updating user points:', error);
            });

            toast.success(`🎉 You have added your project ! As a token of our appreciation, we have credited your account with 100 EXP! 💰`, {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        // await addDocument(mentor);
        if (!formError) {
            history.push('/project_home')
            settitle('');
            setindustry('');
            setdescription('');
            setinstruction('');
            setFormError(null);
            dismissPanel();
        }
    }

    return (
        <>
        <div>
            <DefaultButton style={{ backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '16px', borderRadius: '4px', padding: '10px 20px' }}
                text="Add Your Creation" onClick={openPanel} />
            <Panel
                isOpen={isOpen}
                onDismiss={dismissPanel}
                closeButtonAriaLabel="Close"
                isFooterAtBottom={true}
            >
                {/* inside panel content */}
                <>
                    <div className="create-form">
                        <h2 className="page-title">Add Your Creation</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <span>Project Title</span>
                                <input
                                    required
                                    type="text"
                                    onChange={(e) => settitle(e.target.value)}
                                    value={Title}
                                />
                            </label>
                            <label>
                                <span>Description</span>
                                <textarea
                                    required
                                    onChange={(e) => setdescription(e.target.value)}
                                    value={description}
                                ></textarea>
                            </label>
                            <label>
                                <span>Industry</span>
                                <Select
                                    value={industry}
                                    onChange={(option) => setindustry(option)}
                                    options={Pindustry}
                                />
                            </label>
                            <label>
                                <span>Any Specific instruction for Joiner</span>
                                <input
                                    required
                                    type="text"
                                    onChange={(e) => setinstruction(e.target.value)}
                                    value={instruction}
                                />
                            </label>

                            <button className="btn" style={{ margin: '10px' }}>Lets Go!</button>
                            <button className="btn" onClick={dismissPanel} style={{ margin: '10px' }}>Still Noob</button>
                            {formError && <p className="error">{formError}</p>}
                        </form>
                    </div>
                </>
            </Panel>

        </div>
        <ToastContainer style={{ width: "1200px", fontFamily: 'Poppins' }} />
        </>
    )

}