import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from "../../components/Avatar"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'



export default function Mentorreview({ mentor }) {
    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore('Mentors')
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

        await updateDocument(mentor.id, {
            comments: [...mentor.comments, commentToAdd],
        })
        if (!response.error) {
            setNewComment('')
        }
    }

    return (
        <div className="project-comments" style={{fontFamily: 'Poppins'}}>
            <h4>Mentor Review</h4>
            <ul>
                {mentor.comments.length > 0 && mentor.comments.slice(-4).reverse().map((comment) => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <form className="add-comment" onSubmit={handleSubmit}>
                <label>
                    <span>Add a Review</span>
                    <textarea
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                </label>
                <button className="btn">Review</button>
            </form>
        </div>
    )

}