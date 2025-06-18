import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { Navigate, Link } from "react-router-dom"
import { notifyError } from "../hooks/useToaster"
import { Utils } from "../utils/Utils"

// > assets 
import '../css/admin.css';
import checkSVG from '../assets/check.svg'
import pendingSVG from '../assets/pending.svg'
import deletedSVG from '../assets/deleted.svg'
import anonSVG from '../assets/anon.svg'
import findBoardSVG from '../assets/find-board.svg'
import deleteNoteSVG from '../assets/delete-note.svg'
import dateascSVG from '../assets/date-asc.svg'
import datedesSVG from '../assets/date-des.svg'
import pendingWhiteSVG from '../assets/pending-white.svg'
import userSVG from '../assets/user.svg'
import approveSVG from '../assets/approve.svg'
import noteiconSVG from '../assets/note-icon.svg'

const Admin = () => {

    const [ notes, setNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState()
    const [ sort, setSort ] = useState('date-des')
    const [ active, setActive ] = useState('notes')
    const [ users, setUsers ] = useState()

    const { user } = useAuthContext()
    const { formatDate } = Utils()
    const apiURL = import.meta.env.VITE_API_URL;

    const SUDOfetchNotes = async () => {
        setIsLoading(true);
        try{
            const response = await fetch(`${apiURL}/api/note/all?sort=${sort}`, {
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setNotes(json.notes.notes);
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error );
            }
        } catch (error){
            setIsLoading(false);
            notifyError(error.message)
        }
    }

    const handleGetNotes = () => {
        SUDOfetchNotes()
        setActive('notes')
    }

    const handleGetUsers = async () =>{
        setIsLoading(true)
        try{
            const response = await fetch(`${apiURL}/api/user/all`, {
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setUsers(json.users);
                console.log(json.users)
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error );
            }
        } catch (error){
            setIsLoading(false);
            notifyError(error.message)
        }
        setActive('users')
    }

    // ? Put "user" as dependency
    // ! First app mount, user token is undefine
    // ! Second app mount, user token is define
    // ? That's why refetch everytime user is change/remount
    useEffect(()=>{
        if (user.token){
            SUDOfetchNotes();
        } 
    }, [user, sort])

    if (user.role == "guest") return (<p>Loading...</p>);
    if (!user || user.role !== "admin") return <Navigate to="/" replace />;

    return(
        <>
            <section id="admin">
                <h1>@{user.username} | Admin Panel</h1>
                <div className="all-notes">
                    <div className="admin-navigation-container">
                        <h2 
                            className={(active === "notes") && 'active'}
                            onClick={handleGetNotes}
                        >All Notes</h2>

                        <h2 
                            className={(active === "users") && 'active'}
                            onClick={handleGetUsers}
                        >Users</h2>
                    </div>
                    
                    { (active === 'notes') && (
                        <div className="sort-container">
                            <h3>Sort by:</h3>
                            <div>
                                <img className={(sort=="date-des") && 'selected'} src={datedesSVG} alt="" />
                                <p 
                                    className={(sort=="date-des") && 'selected'} 
                                    onClick={() => setSort('date-des')}>Date Descending</p>
                            </div>
                            <div>
                                <img className={(sort=="date-asc") && 'selected'} src={dateascSVG} alt="" />
                                <p 
                                    className={(sort=="date-asc") && 'selected'} 
                                    onClick={() => setSort('date-asc')}>Date Ascending</p>
                            </div>
                            <div>
                                <img className={(sort=="pending") && 'selected'} src={pendingWhiteSVG} alt="" />
                                <p 
                                    className={(sort=="pending") && 'selected'} 
                                    onClick={() => setSort('pending')} >Pending Notes first</p>
                            </div>
                            
                        </div>
                    )}
                    
                   
                    <div className="notes-container">
                        {(notes && (active === 'notes')) && notes.map((note, index) => (
                            <div 
                                className={`note ${note.status}`}
                                key={note._id || index}
                                >
                                <p className='note-title'>{note.title}</p>
                                <p className='note-date'>{formatDate(note.createdAt)}</p>
                                <p className='note-body'>{note.body}</p>
                                { note.anon && (
                                    <div className="note-anon-wrapper">
                                        <img style={{width: "1.5rem"}} src={anonSVG} alt="" />
                                        <p style={{fontSize: "1rem"}} className='note-anon'>Anonymous | @{note.user_username}</p>
                                    </div>
                                )}

                                { !note.anon && (
                                    <div className="note-anon-wrapper">
                                        <img style={{width: "1.5rem"}} src={userSVG} alt="" />
                                        <p style={{fontSize: "1rem"}} className='note-anon'>Public | @{note.user_username}</p>
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
                                    <div className="approve-container">
                                        <img src={approveSVG} alt="" />
                                        <p>Approve</p>
                                    </div>
                                )}
                                
                            </div>
                        ))}
                    </div>

                    <div className="users-container">
                        {(users && (active === 'users')) && users.map(user => (
                            <div className="user" key={user._id}>
                            <p className="user-username">
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p className="user-role">
                                <strong>Role:</strong> {user.role}
                            </p>
                            <p className="user-id">
                                <strong>ID:</strong> {user._id}
                            </p>
                            {/* Optionally show createdAt if available */}
                            {user.createdAt && (
                                <p className="user-date">
                                <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            )}
                            <div className="view-user-note-container">
                                <img src={noteiconSVG} alt="" />
                                <p className="view-notes">View Notes ({user.notes.length})</p>
                                <span></span>
                            </div>
                            </div>
                        ))}
                        </div>
                </div>
            </section>
        </>
    )
}

export default Admin