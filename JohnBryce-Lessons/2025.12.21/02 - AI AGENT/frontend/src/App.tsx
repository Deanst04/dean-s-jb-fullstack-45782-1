import { useState, FormEvent, ChangeEvent } from 'react'
import axios from 'axios'
import './App.css'

// Define the API response interface
interface ApiResponse {
  question: string
  answer: string
}

function App() {
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setLoading(true)
    setAnswer('')
    
    try {
      const response = await axios.post<ApiResponse>(
        'http://127.0.0.1:5000/api/ask',
        { question },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      setAnswer(response.data.answer)
    } catch (error) {
      console.error('Error:', error)
      setAnswer('Error: Could not connect to server')
    }
    
    setLoading(false)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value)
  }

  return (
    <div className="container">
      <h1>🍳 Culinary AI Assistant</h1>
      <p>Ask me anything about cooking!</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="How do I make pasta?"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cooking...' : 'Ask Chef'}
        </button>
      </form>
      
      {answer && (
        <div className="answer">
          <h3>Chef's Answer:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App

