import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notifyError } from '../hooks/useToaster';
import '../css/profileinfo.css';

const ProfileInfo = ({ user }) => {

    const [ backButton, setBackButton ] = useState("< Back");
    const [ notes, setNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState(false)

    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    const fetchUserNote = async () => {
        setIsLoading(true)

        try{
            const response = await fetch(`http://localhost:4000/api/note/user/${user.username}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok){
                setIsLoading(false);
                notifyError("Error getting your notes...")
                return
            }
            if (response.ok){
                setIsLoading(false);
                setNotes( json.notes );
                console.log("User's note: ");
                console.log(json.notes);
            }
        } catch (er){
            console.log('hi')
        }
    }

    useEffect(() => {
        fetchUserNote();
    }, [])

    return(
        <>
            <section id="profile-info">
                <h1 className="username">@{user.username}</h1>
                <Link to="/">
                    <span
                        className='back'
                        onMouseOver={() => {
                            setBackButton("< Home")
                            console.log("Hello!")
                        }}
                        onMouseLeave={() => setBackButton("< Back")}
                    >
                        {backButton}
                    </span>
                </Link>  

                <div className="my-notes">
                    <h2>My Notes</h2>
                    { isLoading && (<p>Loading ...</p>)}
                    
                    <div className="notes-container">
                        {notes && notes.map((note, index) => (
                            <div 
                                className={`note ${note.status}`}
                                key={note._id || index}
                                // onClick = { () => {
                                //     setSelectedNote(note)
                                //     setShowModal(true)
                                // }}
                                >
                                <p className='note-title'>{note.title}</p>
                                <p className='note-date'>{formatDate(note.createdAt)}</p>
                                <p className='note-body'>{note.body}</p>
                                <p className='note-anon'>{note.anon ? ("Anonymous ✓") : ("")}</p>
                                <p className='note-status'>{note.status}</p>
                                <p className='note-delete'>Delete</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default ProfileInfo