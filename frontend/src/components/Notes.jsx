// TODO : Add pagination

import { useState, useEffect } from 'react'
import { notifySuccess, notifyError } from '../hooks/useToaster';
import { useAuthContext } from '../hooks/useAuthContext';
import ViewNote from './ViewNote';
import '../css/notes.css'

const Notes = () => {

    const [notes, setNotes] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [nextPage, setNextPage] = useState();
    const [prevPage, setPrevPage] = useState(1);
    const [ atFirstPage, setAtFirstPage] = useState();
    const [ atLastPage, setAtLastPage] = useState();
    const [ sudo, setSudo ] = useState(false) 

    const [selectedNote, setSelectedNote] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { user } = useAuthContext();

    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    const fetchNotes = async () => {
        setIsLoading(true);

        try{
            const response = await fetch(`http://localhost:4000/api/note?page=${page}&limit=10`)
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setNotes(json.notes.notes);
                setTotalPages(json.notes.totalPages);
                setNextPage(prev => (page + 1))
                setAtFirstPage(true)
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError('Ohh no! Failed to get notes!')
            }
        } catch (error){
            setIsLoading(false);
            notifyError('Server is offline ZZZ')
        }
    }

    const SUDOfetchNotes = async () => {
        setIsLoading(true);
        setSudo(true)

        try{
            const response = await fetch(`http://localhost:4000/api/note/all?page=${page}`, {
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setNotes(json.notes.notes);
                setTotalPages(json.notes.totalPages);
                setNextPage(prev => (page + 1))
                setAtFirstPage(true)
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError( json.error );
            }
        } catch (error){
            setIsLoading(false);
            notifyError('Server is offline ZZZ')
        }
    }

    const fetchNextPage = async () => {
        setIsLoading(true);
        
        try{
            const response = await fetch(`http://localhost:4000/api/note?page=${nextPage}&limit=10`)
            const json = await response.json();

            if (response.ok){

                if (atLastPage){
                    setIsLoading(false);
                    return
                }

                if (totalPages == (page + 1)){
                    setAtLastPage(true)
                }

                setIsLoading(false);
                setPage(prev => (prev + 1))
                setNotes(json.notes.notes)
                setNextPage(prev => (prev + 1))
            }

            if (!response.ok){
                setIsLoading(false);
                notifyError('Something went wrong...')
            }

        } catch (error){
            setIsLoading(false);
            notifyError('Server is offline ZZZ');
        }
    }

    const fetchPrevPage = async () => {
        if (page <= 1) {
            setAtFirstPage(true);
            return;
        }
        setIsLoading(true);

        try {
            const prev = page - 1;
            const response = await fetch(`http://localhost:4000/api/note?page=${prev}&limit=10`);
            const json = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setPage(prev);
                setNextPage(prev => ( prev - 1))
                setNotes(json.notes.notes);
                setAtLastPage(false);
                if (prev === 1) setAtFirstPage(true);
                else setAtFirstPage(false);
            } else {
                setIsLoading(false);
                notifyError('Something went wrong...');
            }
        } catch (error) {
            setIsLoading(false);
            notifyError('Server is offline ZZZ');
        }
    };

    // TODO Implement conditional implementing
    // ! user state updates twice per refresh. First has null, second is OK
    useEffect( () => {
        fetchNotes();
    }, [])

    return (
        <>
            { selectedNote && showModal && (
                <ViewNote 
                    note = {selectedNote}
                    onClose = { () => setShowModal(false)}
                    onSUDO = { () => SUDOfetchNotes()}
                />
            )}
            
            <section id="notes">
                <div className="heading">
                    <h1>Recent Notes</h1>
                </div>
                { (!notes && !isLoading) && (
                    <>
                        <p>No Notes</p>
                    </>
                )}
                <div className="notes-container">
                    {notes && notes.map((note, index) => (
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

                {(!isLoading && totalPages && !sudo) && (
                    <div className="pagination-container">
                        <div className="pagination">
                            <p
                                className={page <= 1 ? 'prev disabled' : 'prev'}
                                onClick={page > 1 ? fetchPrevPage : undefined}
                                style={{ cursor: page > 1 ? 'pointer' : 'not-allowed' }}
                            >
                                {page <= 1 ? 'X' : '<'}
                            </p>
                            <p className='pagenum'>{page}/{totalPages}</p>
                            { (!atLastPage && (totalPages != 1)) ? (
                                <p className='next' onClick={fetchNextPage}>{`>`}</p>
                            ) : (
                                <p className='disabled'> X </p>
                            )}
                        </div>
                    </div>
                )}

                { isLoading && (
                    <p className='loading'>Loading ...</p>
                )}

                { (user && user.role === "admin") && (
                    <p className='sudogetall' onClick={SUDOfetchNotes}>❄️ SUDO GET ALL ❄️</p>
                )}
            </section>
        </>
    )
}

export default Notes