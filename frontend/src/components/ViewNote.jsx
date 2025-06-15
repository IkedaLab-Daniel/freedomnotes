import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import { notifySuccess, notifyError } from '../hooks/useToaster';
import { Utils } from '../utils/Utils';

// > Assets
import userSVG from '../assets/user.svg'
import anonSVG from '../assets/anon.svg'
import '../css/viewNote.css';


const ViewNote = ({note, onClose, onSUDO } ) => {
    if (!note) return null;

    const [ isLoading, setIsLoading ] = useState(false);
    const { user } = useAuthContext();
    const { formatDate } = Utils();
    const apiURL = import.meta.env.VITE_API_URL;

    const approveNote = async () => {
        setIsLoading(true)

        try{
            const response = await fetch(`${apiURL}/api/note/${note._id}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })    
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                notifySuccess('Approved!')
                onSUDO();
                onClose();  
            } 

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error )
            }
        
        } catch (error){
            setIsLoading(false)
            notifyError('Server offline ZZZ')
        }
    }

    const unlistNote = async () => {
        setIsLoading(true);

        try{
            const response = await fetch(`${apiURL}/api/note/${note._id}/archive`, {
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
        }
    }
    return(

        <>
            <div className="black-bg"></div>
            <div id="view-note-modal">
                <div className="view-note">
                    <h2 className='title'>{note.title}</h2>
                    { note.anon ? (
                        <div className="username-wrapper">
                            <img src={anonSVG} alt="" />
                            <p className='username'>Anonymous</p>
                        </div>
                    ): (
                        <div className="username-wrapper">
                            <img src={userSVG} alt="" />
                            <p className='username'>@{note.user_username}</p>
                        </div>
                        
                    )}
                    <p className='date'>{formatDate(note.createdAt)}</p>
                    <p className='content'>{note.body}</p>
                    <p className='close' onClick={onClose}>X Close</p>
                    { ((note.status !== "archived" || note.status === "pending") && user.role === "admin") && (
                        <p className='delete' onClick={unlistNote}>❌ Delete</p>
                    )}
                    
                    {( note.status === "pending" || note.status === "archived") && (
                        <p className='approve' onClick={approveNote}>✅ Approve</p>
                    )}
                    { isLoading && (<p style={{color: "black"}}>Loading ...</p>)}
                </div>
            </div>
        </>
    )
}

export default ViewNote