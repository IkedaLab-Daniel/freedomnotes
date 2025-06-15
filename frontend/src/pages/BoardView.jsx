import { useState, useEffect } from "react"
import { useParams , Link } from "react-router-dom"
import { notifySuccess, notifyError } from "../hooks/useToaster"
import Notes from "../components/Notes"
import Footer from "../components/Footer"
import ViewNote from "../components/ViewNote"
import AddNoteModal from "../components/AddNoteModal"
import '../css/notes.css'
const BoardView = () => {

    const [ boardNotes, setBoardNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ boardName, setBoardName ] = useState();
    const [ pendingNotes, setPendingNotes ] = useState();
    const [ totalNotes, setTotalNotes ]= useState();
    const [showModal, setShowModal] = useState(false);
    const [ showAddModal, setShowAddModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const  { board_id } = useParams()
    const apiURL = import.meta.env.VITE_API_URL;

    const limitMessage = ( message ) => {
        if ( message.length > 70){
            const shortMessage = message.slice(0, 70)
            return `${shortMessage}...`
        }
        return message
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }   

    const fetchBoardData = async () => {
        setIsLoading(true)

        try{
            const response = await fetch(`${apiURL}/api/note/board/${board_id}`)
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setBoardNotes(json.notes.notes)
                setBoardName(json.notes.boardName)
                setPendingNotes(json.notes.pendingNotes)
                console.log(json)
                setTotalNotes(parseInt(json.notes.notes.length) + json.notes.pendingNotes)
            }

            if (!response.ok){
                setIsLoading(false)
                notifyError(json.error)
            }
        } catch (error){
            setIsLoading(false)
            console.log (error)
        }
    }

    useEffect( () => {
        fetchBoardData()
    }, [])

    return(
        <>
            { (selectedNote && showModal ) && (
                <ViewNote 
                    note = {selectedNote}
                    onClose = { () => {setShowModal(false)}}
                    onSUDO = { () => fetchBoardData()}
                />
            )}
            <section id="notes">
                <div className="heading">
                    <h1>{boardName ? (boardName) : "..."}</h1>
                </div>
                <div className="notes-container">
                    { isLoading && (<p className="loading">Loading...</p>)}
                    { boardNotes && boardNotes.map((note, index) => (
                        <div 
                            className={`note ${note.status}`}
                            key={note._id || index}
                            onClick = { () => {
                                setSelectedNote(note)
                                setShowModal(true)
                            }}>
                            <p className='note-title'>"{note.title}"</p>
                            <p className='note-date'>{formatDate(note.createdAt)}</p>
                            <p className='note-body'>{limitMessage(note.body)}</p>
                        </div>
                    ))}
                    { (pendingNotes > 0) && (
                        <div className="note pending-notes">
                            <p className="note-title">{pendingNotes} notes pending</p>
                        </div>
                    )}
                    
                </div>

                <div className="btn-container">
                    <Link to="/">
                        <p className="back">{`< Back`}</p>
                    </Link>
                    { (totalNotes >= 20) ? (
                        <span className="full">Board is full!</span>
                    ) : (
                        <p 
                        className="addNote"
                            onClick={() => setShowAddModal(true)}
                        >+ Add Note</p>
                    )}
                    
                </div>

            </section>
            <Notes />
            <Footer />
            { showAddModal && (
                <AddNoteModal 
                    onClose = { () => {setShowAddModal(false)}}
                    onSUDO = { () => fetchBoardData()}
                    board = {board_id}
                    totalNotes = {totalNotes}
                />
            )}
        </>
    )
}

export default BoardView