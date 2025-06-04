// TODO : Add pagination

import { useState, useEffect } from 'react'
import { notifySuccess, notifyError } from '../hooks/useToaster';
import '../css/notes.css'

const Notes = () => {

    const [notes, setNotes] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [nextPage, setNextPage] = useState();
    const [ atLastPage, setAtLastPage] = useState();

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
            const response = await fetch(`http://localhost:4000/api/note?page=${page}`)
            const json = await response.json();

            if (response.ok){
                setIsLoading(false);
                setNotes(json.notes.notes);
                setTotalPages(json.notes.totalPages);
                setNextPage(prev => (page + 1))
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

    const fetchNextPage = async () => {
        setIsLoading(true);
        
        try{
            const response = await fetch(`http://localhost:4000/api/note?page=${nextPage}`)
            const json = await response.json();

            if (response.ok){

                if (atLastPage){
                    setIsLoading(false);
                    return
                }

                if (totalPages == (page + 1)){
                    setIsLoading(false)
                    setNextPage(prev => (prev))
                    setNotes(json.notes.notes)
                    setAtLastPage(true)
                    setPage(prev => (prev + 1))
                    console.log("REACH LAST PAGE")
                    return
                }

                setIsLoading(false);
                setPage(prev => (prev + 1))
                setNotes(json.notes.notes)
                setNextPage(prev => (prev + 1))
            }

        } catch (error){
            setIsLoading(false);
            notifyError('Server is offline ZZZ');
        }
    }

    useEffect( () => {
        fetchNotes();
    }, []);

    return (
        <>
            <section id="notes">
                <div className="heading">
                    <h1>Recent Notes</h1>
                </div>
                { !notes && (
                    <>
                        <p>No Notes</p>
                    </>
                )}
                <div className="notes-container">
                    {notes && notes.map((note, index) => (
                        <div className="note" key={note._id || index}>
                            <p className='note-title'>{note.title}</p>
                            <p className='note-date'>{formatDate(note.createdAt)}</p>
                        </div>
                    ))}
                </div>

                {(!isLoading && totalPages) && (
                    <div className="pagination-container">
                        <div className="pagination">
                            <p className='prev'>{`<`}</p>
                            <p className='pagenum'>{page}/{totalPages}</p>
                            { !atLastPage ? (
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
            </section>
        </>
    )
}

export default Notes