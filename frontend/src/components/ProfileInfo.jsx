import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notifyError } from '../hooks/useToaster';
import { Utils } from '../utils/utils';

// > assets
import '../css/profileinfo.css';
import checkSVG from '../assets/check.svg'
import pendingSVG from '../assets/pending.svg'
import deletedSVG from '../assets/deleted.svg'
import anonSVG from '../assets/anon.svg'
import findBoardSVG from '../assets/find-board.svg'
const ProfileInfo = ({ user }) => {

    const [ backButton, setBackButton ] = useState("< Back");
    const [ notes, setNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState(false)

    const { formatDate } = Utils()

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

    const unlistNote = async ( note_id ) => {
        setIsLoading(true);

        try{
            const response = await fetch(`http://localhost:4000/api/note/${note_id}/archive`, {
                method : "PATCH",
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const json = await response.json()

            if (response.ok){
                setIsLoading(false);
                notifySuccess('Note Deleted')
                onClose()
                onSUDO();  
            }

            if (!response.ok){
                setIsLoading(false)
                notifyError( json.error )
            }

        } catch (error){
            setIsLoading(false);
            notifyError( 'Server offline ZZZ' )
            console.log(error)
        }
    }    

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
                                { note.anon && (
                                    <div className="note-anon-wrapper">
                                        <img src={anonSVG} alt="" />
                                        <p className='note-anon'>Anonymous</p>
                                    </div>
                                )}

                                <div className="find-on-board-wrapper">
                                    <Link to={`/board/${note.board_id}`}>
                                        <img src={findBoardSVG} />
                                        <p className='find-on-board'>Find on Boards</p>
                                    </Link>
                                </div>
                                

                                <div className="status-container">
                                    { (note.status == "approved") && (
                                        <>
                                            <img src={checkSVG} className="status-svg" />
                                            <p className='note-status approved'>Approved</p>
                                        </>
                                    ) }
                                    { (note.status == "pending") && (
                                        <>
                                            <img src={pendingSVG} className="status-svg" />
                                            <p className='note-status pending'>Pending</p>
                                        </>
                                    ) }
                                    { (note.status == "archived") && (
                                        <>
                                            <img src={deletedSVG} className="status-svg" />
                                            <p className='note-status archived'>Deleted</p>
                                        </>
                                    ) }
                                </div>
                                
                                {/* { (note.status !== "archived") && (
                                // TODO : If the note is from the user, let the user archieve the noite
                                    <p 
                                        className='note-delete'
                                        onClick={ () => unlistNote(note._id) }
                                        >
                                    Delete
                                    </p>
                                )} */}
                                
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default ProfileInfo