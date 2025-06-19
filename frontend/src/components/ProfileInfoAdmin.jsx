// > Tihs is like the ProfileInfo.jsx, but for admin to view user's notes
// ? I decided to add this seperated component rather than reusing the ProfileInfo,
// ? so no need to add complex logix just for this feature


import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from '../hooks/useToaster';
import { Utils } from '../utils/Utils';
import { useAuthContext } from '../hooks/useAuthContext';

// > assets
import '../css/profileinfo.css';
import checkSVG from '../assets/check.svg'
import pendingSVG from '../assets/pending.svg'
import deletedSVG from '../assets/deleted.svg'
import anonSVG from '../assets/anon.svg'
import findBoardSVG from '../assets/find-board.svg'
import deleteNoteSVG from '../assets/delete-note.svg'
import approveSVG from '../assets/approve.svg'


const ProfileInfoAdmin = () => {

    const [ backButton, setBackButton ] = useState("< Back");
    const [ notes, setNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState(false)
    const [ deteleModal, setDeleteModal ] = useState(false)
    const [ noteToDelete, setNoteToDelete ] = useState();
    const [ deleteLoading, setDeleteLoading ] = useState(false)
    const { formatDate, softLogout } = Utils()
    const apiURL = import.meta.env.VITE_API_URL;

    const userDetail = JSON.parse(localStorage.getItem("userDetail"))
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleBack = () =>{
        localStorage.removeItem("userDetail")
        navigate("/admin")
    }

    const fetchUserNote = async () => {
        setIsLoading(true)

        try{
            const response = await fetch(`${apiURL}/api/note/user/${userDetail.username}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (!response.ok){
                setIsLoading(false);
                notifyError(json.error)
                if (json.error === "Session Expired"){
                    softLogout();
                }
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
        if (user.token, user.role === "admin"){
            fetchUserNote();
        }   
    }, [user])

    const unlistNoteByUser = async ( note_id ) => {
        setDeleteLoading(true)

        try{
            const response = await fetch(`${apiURL}/api/note/archive-by-user?note_id=${note_id}&username=${userDetail.username}`, {
                method : "PATCH",
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const json = await response.json()

            if (response.ok){
                notifySuccess('Note Deleted')
                fetchUserNote()
                setDeleteModal(false)
                setDeleteLoading(false)

            }

            if (!response.ok){
                notifyError( json.error )
                setDeleteLoading(false)

            }

        } catch (error){
            setDeleteLoading(false)
            notifyError( 'Server offline ZZZ' )
            console.log(error)
        }
    }    

    const passDeleteNote = ( note_id ) => {
        setDeleteModal(true);
        setNoteToDelete(note_id)
    }

    const approveNote = async ( note_id ) => {
        setIsLoading(true)

        try{
            const response = await fetch(`${apiURL}/api/note/${note_id}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })    
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                notifySuccess('Approved!');
                fetchUserNote();
            } 

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error );
            }
        
        } catch (error){
            setIsLoading(false)
            notifyError('Server offline ZZZ')
        }
    }

    if (user){
        return(
            <>
                <section id="profile-info" style={{paddingTop: "70px"}}>
                    {/* <h1 className="username">@{userDetail.username}</h1> */}
                    <span
                        className='back'
                        onMouseOver={() => {
                            setBackButton("< Admin")
                        }}
                        onMouseLeave={() => setBackButton("< Back")}
                        onClick={handleBack}
                    >
                        {backButton}
                    </span> 

                    <div className="my-notes">
                        {/* <h2>{userDetail.username}'s' Notes</h2> */}
                        { isLoading && (<p>Loading ...</p>)}
                        
                        <div className="notes-container" style={{marginTop: "10px"}}>
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

                                    { (note.status !== "archived" && note.status !== "pending") && (
                                        <div className="find-on-board-wrapper">
                                            <Link to={`/board/${note.board_id}`}>
                                                <img src={findBoardSVG} />
                                                <p className='find-on-board'>Find on Boards</p>
                                            </Link>
                                        </div>
                                    )}

                                    

                                    { (note.status !== "archived") && (
                                    // TODO : If the note is from the user, let the user archieve the noite
                                        <div className="delete-container" onClick={ () => passDeleteNote(note._id) }>
                                            <img src={deleteNoteSVG} alt="" />
                                            <p className='note-delete'>Delete</p>
                                        </div>
                                        
                                    )}

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

                                    { note.status === "pending" && (
                                        <div className="approve-container" onClick={() => approveNote(note._id)}>
                                            <img src={approveSVG} alt="" />
                                            <p>Approve</p>
                                        </div>
                                    )}
                                                                    
                                </div>
                            ))}
                            { (!notes && !isLoading) && (
                                <p>{userDetail.username} has no notes yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                { deteleModal && (
                    <div className="modal-container">
                        <div className="black-bg"></div>
                        <div className="confirm-modal">
                            <h2>Delete Note?</h2>
                            <p>This action cannot be undo</p>
                            { deleteLoading ? (
                                <button className='confirm deleting'>Deleting...</button>
                            ) : (
                                <button className='confirm' onClick={() => unlistNoteByUser(noteToDelete)}>Confirm</button>
                            )}
                            <button className='cancel' onClick={() => setDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}    
            </>
            )
        }

        if (!userDetail){
            return(<p>No user selected to view note</p>)
        }

    }

    

export default ProfileInfoAdmin