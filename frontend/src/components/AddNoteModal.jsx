import '../css/addnotemodal.css'
const AddNoteModal = () => {

    return(
        <>
            <div className="black-bg"></div>
            <div className="add-note-modal">
                <form action="">
                    <div className="input-group">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" />
                    </div>
                    <label htmlFor="message">Message: </label>
                    <textarea name="message" id="message"></textarea>
                    <div className="btn-container">
                        <p className='add-btn'>+ Add Note</p>
                        <p className='cancel-btn'>X Cancel</p>
                    </div>
                </form>

            </div>
        </>
    )
}

export default AddNoteModal