import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNote } from '../../../actions/post'

const NoteForm = ({ postId, addNote }) => {
  const [content, setText] = useState('')

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Leave a Note</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault()
          addNote(postId, { content })
          setText('')
        }}>
        <textarea
          name='content'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={content}
          onChange={e => setText(e.target.value)}
          required />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

NoteForm.propTypes = {
  addNote: PropTypes.func.isRequired
}

export default connect(null, { addNote })(NoteForm)

