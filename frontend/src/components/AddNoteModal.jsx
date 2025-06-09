import { useState } from 'react'
import { notifySuccess, notifyError } from '../hooks/useToaster';
import { useAuthContext } from '../hooks/useAuthContext';
import '../css/addnotemodal.css'

const AddNoteModal = ( { onSUDO, onClose, board, totalNotes } ) => {

    const { user } = useAuthContext()

    const [ title, setTitle ] = useState('');
    const [ message, setMessage ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('')

    const addNote = async (e) => {
        e.preventDefault()
        setIsLoading(true);

        try{
            const response = await fetch('http://localhost:4000/api/note', {
                method: "POST",
                headers : {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body : JSON.stringify({
                    title: title,
                    body: message,
                    board_id: board,
                    user_username: user.username,
                    tags: ["test"]
                })
            })

            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                notifySuccess('Note Added! Wait for admin approval...');
                setError();
                onClose();
                onSUDO();
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error );
                setError( json.error );
            }


        } catch (error){
            setIsLoading(false)
            notifyError('Server is offline')
            setError('Server is offline')
            console.log( error )
        }
    }

    return(
        <>
            <div className="black-bg"></div>
            <div className="add-note-modal">
                <form action="" onSubmit={addNote}>
                    <div className="input-group">
                        <label htmlFor="title">Title:</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <label htmlFor="message">Message: </label>
                    <textarea 
                        name="message" 
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}></textarea>
                    <div className="btn-container">
                        <button className='add-btn'>+ Add Note</button>
                        <button className='cancel-btn' onClick={onClose}>X Cancel</button>
                    </div>
                    { isLoading && (
                        <p className='loading'>Adding</p>
                    )} 
                    { error && (
                        <p className='error'>{error}</p>
                    )} 
                </form>
                
            </div>
        </>
    )
}

export default AddNoteModal