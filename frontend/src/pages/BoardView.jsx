import { useState } from "react"
import { useParams } from "react-router-dom"
import { notifySuccess, notifyError } from "../hooks/useToaster"
import Notes from "../components/Notes"
import Footer from "../components/Footer"
import '../css/notes.css'
const BoardView = () => {

    const [ boardNotes, setBoardNotes ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const  { board_id } = useParams()

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
            const response = await fetch(`http://localhost:4000/api/note/board/${board_id}`)
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setBoardNotes(json.notes)
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

    return(
        <>
            <h1 onClick={fetchBoardData}>Hello</h1>
            <section id="notes">
                <div className="notes-container">
                    {boardNotes && boardNotes.map((note, index) => (
                        <div 
                            className={`note ${note.status}`}
                            key={note._id || index}
                            onClick = { () => {
                                setSelectedNote(note)
                                setShowModal(true)
                            }}>
                            <p className='note-title'>{note.title}</p>
                            <p className='note-date'>{formatDate(note.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Notes />
            <Footer />
        </>
    )
}

export default BoardView