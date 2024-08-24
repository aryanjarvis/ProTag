import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from "../../components/Avatar"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'


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

export default function ProjectComments({ project }) {
  const { user } = useAuthContext()
  const { updateDocument, response } = useFirestore('projects')
  const [newComment, setNewComment] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random()
    }
    
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    })

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
    if (!response.error) {
      setNewComment('')
    }
  }

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 && project.comments.map(comment => (
          <li key={comment.id}>
            <div className="comment-author">
              <Avatar src={comment.photoURL} />
              <p>{comment.displayName}</p>
            </div>
            <div className="comment-date">
              <p>{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</p>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea 
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
      <ToastContainer style={{ width: "600px", fontFamily: 'Poppins' }} />

    </div>
  )
}