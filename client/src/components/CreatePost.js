import React, { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const CreatePost = ({ posts, setPosts }) => {
  const { user } = useAuthContext()

  const [formText, setFormText] = useState("")

  const handleForm = async (e) => {
    e.preventDefault()
    const response = await fetch("https://odin-book.site/api/create-post", {
      headers: {
        'Authorization': 'Bearer ' + user.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: formText }),
      method: 'POST'
    })

    const json = await response.json()

    if (response.ok) {
      const newState = [json].concat(posts)
      setPosts(newState)
      setFormText("")
    }
  }

  return (
    <div className="create-post">
      <form onSubmit={(e) => handleForm(e)}>
        <textarea type="text" value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="What is on your mind?" />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default CreatePost