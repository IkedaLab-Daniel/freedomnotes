import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import { notifySuccess, notifyError } from '../hooks/useToaster';
import '../css/viewNote.css';


const ViewNote = ({note, onClose, onSUDO } ) => {
    if (!note) return null;

    const [ isLoading, setIsLoading ] = useState(false);
    const { user } = useAuthContext();

    const approveNote = async () => {
        setIsLoading(true)

        try{
            const response = await fetch(`http://localhost:4000/api/note/${note._id}/approve`, {
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
            const response = await fetch(`http://localhost:4000/api/note/${note._id}/archive`, {
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
                    <p className='content'>{note.body}</p>
                    { note.anon ? (
                        <p className='username anon'>- Anonymous {note.anon}</p>
                    ): (
                        <p className='username'>- @{note.user_username} {note.anon}</p>
                    )}
                    
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