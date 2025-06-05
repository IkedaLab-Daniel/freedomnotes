import '../css/viewNote.css';


const ViewNote = ({note, onClose, onUnlist} ) => {
    if (!note) return null;

    return(
        <>
            <div className="black-bg"></div>
            <div id="view-note-modal">
                <div className="view-note">
                    <h2 className='title'>{note.title}</h2>
                    <p className='content'>{note.body}</p>
                    <p className='close' onClick={onClose}>X Close</p>
                    <p className='delete' onClick={onUnlist}>! Delete</p>
                </div>
            </div>
        </>
    )
}

export default ViewNote