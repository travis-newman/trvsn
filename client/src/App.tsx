import { useEffect, useState } from 'react'
import './App.css'
import { ContactForm } from './ContactForm'

function App() {
  const [greeting, setGreeting] = useState('Loading…')

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data: { message: string }) => setGreeting(data.message))
      .catch(() => setGreeting('Could not reach the server.'))
  }, [])

  return (
    <section id="center">
      <div>
        <h1>{greeting}</h1>
        <p>This message came from the server at <code>/api/hello</code>.</p>
      </div>
      <h2 style={{ marginTop: 48 }}>Get in touch</h2>
      <ContactForm />
    </section>
  )
}

export default App
