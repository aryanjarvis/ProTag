import { Link } from 'react-router-dom'
import { Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { Label } from '@fluentui/react/lib/Label';
import { Stack } from '@fluentui/react/lib/Stack';
import { useHistory } from 'react-router-dom'
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useAuthContext } from '../hooks/useAuthContext'
import { projectFirestore } from "../firebase/config"
import { useDocument } from '../hooks/useDocument'
import { useState } from 'react';
import { array_add } from "../firebase/config"
import { useFirestore } from "../hooks/useFirestore"
// styles
import './ProjectList.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//component import
import PersonaDetails from './testpersona';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

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


export default function ProjectHomeList({ projects }) {
    // const Handlesubmit=(projectOwner)=>{
    //     // const document = projectFirestore.collection('users').doc({projectOwner})  
    //     const { document, error } = useDocument('users', projectOwner)        
    //     console.log("Final things in document",document.points)
    // }
    const history = useHistory()
    const db = firebase.firestore();
    const { user } = useAuthContext()
    const { deleteDocument, response } = useFirestore('Project_home');
    const { document, error } = useDocument('users', user.uid);



    //     const history = useHistory()
    //   const { addDocument, response } = useFirestore('projects')
    //   const { user } = useAuthContext()
    //   const { documents } = useCollection('users')
    //   const [users, setUsers] = useState([])
    const check = document?.project_joined;


    ////Adding Freinds takes time think of it how to group it so that the home page is working
    const handleclick = async (project) => {

        console.log(document.project_joined)


        //for adding memebrs in the project_home the memebr is current userid
        const documentRef = db.collection('Project_home').doc(project.id);
        const fieldToUpdate = 'members';
        documentRef.update({
            [fieldToUpdate]: firebase.firestore.FieldValue.arrayUnion(user.uid)
        })
            .then(() => {
                console.log('Element added to the array successfully!', user.uid);
            })
            .catch((error) => {
                console.error('Error adding element to the array:', error);
            });

        //for updating the project_joinde field in user to porject title
        const documentRef2 = db.collection('users').doc(user.uid);
        const fieldToUpdate2 = 'project_joined';
        documentRef2.update({
            [fieldToUpdate2]: project.Title,
            ['project_add']: true
        })
            .then(() => {
                console.log('Field Updated for user');
            })
            .catch((error) => {
                console.error('Error in updating field:', error);
            });
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

        //toast notification
        toast.success(`🎉 You have successfully joined a group ${project.Title} ! As a token of our appreciation, we have credited your account with 100 EXP! 🚀`, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });


    }

    ///iterate over the members and change there project_joined and project_add of owner
    const handleclickdelete = async (project) => {

        try {
            const arrayRef = db.collection('Project_home').doc(project.id);
            const arrayDoc = await arrayRef.get();

            if (arrayDoc.exists) {
                const data = arrayDoc.data();
                const memberids = data.members;

                // Iterate over the IDs and update documents in the "users" collection
                for (const id of memberids) {
                    const userRef = db.collection('users').doc(id);
                    await userRef.update({
                        ['project_joined']: "",
                        ['project_add']: false
                    });
                }
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.log('Error updating documents:', error);
        }


        await deleteDocument(project.id);


        //owner project_joined and project_add to false
        const documentRef2 = db.collection('users').doc(user.uid);
        const fieldToUpdate2 = 'project_joined';
        documentRef2.update({
            [fieldToUpdate2]: '',
            ['project_add']: false,
        })
        history.push('/project');
    }

    return (
        <>
            <div className="project-list" style={{ background: 'linear-gradient(to bottom, #f5f5f6, #dcdcdc)' }}>
                {projects.length === 0 && <p>No projects yet!</p>}
                {projects.map(project => {
                    //    const document = projectFirestore.collection('users').doc({project.projectOwner.id})           
                    return (

                        <Link >
                            <h4 style={{ fontFamily: 'Poppins' }}>{project.Title}</h4>
                            <div className="assigned-to">
                                <p style={{ fontFamily: 'Poppins' }}>{project.description}</p>
                                <h5 style={{ "border-top": '1px solid #eee', paddingTop: '10px', fontFamily: 'Poppins' }}>What is Expected from Joinee: <Link style={{ borderTop: '1px solid #eee' }}>{project.instruction}</Link></h5>

                                <Stack >
                                    <PersonaDetails project={project} />
                                    {project.projectOwner.id !== user.uid && check === '' && (
                                        <DefaultButton
                                            style={{
                                                backgroundColor: 'var(--primary-color)',
                                                margin: '18px 0px 0px 0px',
                                                color: 'white',
                                                fontSize: '16px',
                                                borderRadius: '4px',
                                                padding: '10px 20px',
                                                width: '70px',
                                                fontFamily: 'Poppins',
                                                marginLeft: '20px'

                                            }}

                                            text="Join"
                                            onClick={() => handleclick(project)}
                                        />
                                    )}
                                </Stack>
                                {project.projectOwner.id === user.uid && (<DefaultButton
                                    style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'Poppins', margin: '18px 0px 0px 0px', marginLeft: '20px', paddingTop: '12px', color: 'white', fontSize: '16px', borderRadius: '4px', padding: '10px 20px' }}
                                    text="Done With this Project?"

                                    onClick={() => handleclickdelete(project)} />)}
                            </div>
                        </Link>
                    )
                })}


            </div>
            <ToastContainer style={{ width: "1200px", fontFamily: 'Poppins' }} />
        </>
    )
}
