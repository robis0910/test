const express = require('express')
const cors = require('cors')
const app = express()

//creates js objects from json data in response body
app.use(express.json())
app.use(express.static('dist'))

app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//gets
app.get('/', (request, response) => {
  response.sendFile('/dist/index.html');
});

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
  
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

//posts
const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

//puts
app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const updatedNote = request.body;
  const noteIndex = notes.findIndex(n => n.id === id);

  console.log(noteIndex)
  notes[noteIndex] = { ...notes[noteIndex], ...updatedNote };
  response.status(200).json(notes[noteIndex]);
  
}) 

//deletes
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
