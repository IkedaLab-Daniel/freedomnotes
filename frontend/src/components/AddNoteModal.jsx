import { useState, useEffect } from 'react'
import { notifySuccess, notifyError } from '../hooks/useToaster';
import { useAuthContext } from '../hooks/useAuthContext';

// > Assets
import '../css/addnotemodal.css'
import addSVG from '../assets/add.svg'
import cancelSVG from '../assets/cancel.svg'
const AddNoteModal = ( { onSUDO, onClose, board, totalNotes } ) => {

    const { user } = useAuthContext()

    const [ title, setTitle ] = useState('');
    const [ message, setMessage ] = useState('')
    const [ anon, setAnon ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);

    // ? Error states
    const [ error, setError ] = useState('')
    const [ titleError, setTitleError] = useState(false)
    const [ messageError, setMessageError ] = useState(false)

    const validateTitle = () => {
        if (title.length >= 25){
            setTitleError(true)
        } else{
            setTitleError(false)
        }
    }

    const validateMessage = () => {
        if (message.length >= 300){
            setMessageError(true)
        } else{
            setMessageError(false)
        }
    }

    useEffect(() => {
        validateTitle()
        validateMessage()
    }, [title, message])

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
                    anon: anon,
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
                    <div className={"input-group"}>
                        <label htmlFor="title">Title:</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={title}
                            className= {titleError && ('has-error')}
                            onChange={(e) => {setTitle(e.target.value)}}
                        />
                    </div>
                    { titleError && (<span className='field-error'>Title must be below 25 characters</span>)}
                    
                    <label htmlFor="message">Message: </label>
                    <textarea 
                        name="message" 
                        id="message"
                        value={message}
                        className= {messageError && ('has-error')}
                        onChange={(e) => setMessage(e.target.value)}></textarea>
                    { messageError && (<span className='field-error'>Message must be below 300 characters</span>)}

                    <div className="checkbox-container">
                        <input 
                            type='checkbox' 
                            checked={anon}
                            onChange={e => setAnon(e.target.checked)}
                        />
                        <span>Anonymous</span>
                    </div>
                     
                    <div className="btn-container">
                        <button 
                            type='submit' 
                            className={`add-btn ${(titleError || messageError) && 'disable'}`}
                        >
                            <img className='btn-icon' src={addSVG}  />
                            <span>Add Note</span>
                        </button>
                        <button className='cancel-btn' onClick={onClose}>
                            <img src={cancelSVG} className="btn-icon" />
                            <span>Cancel</span>
                        </button>
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