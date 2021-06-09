const Note = require('./note.js')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

var notes = new Map()

async function getNotes(queryfilter) {
  if (queryfilter) {
      filterNotes = Array.from(notes.values()).filter(t => new RegExp(queryfilter, 'i').test(t.title))
      // filterNotes = a.filter(t => t.title.lowercase().includes(queryfilter.lowercase()))
      return filterNotes
  }
  return notes
}

async function createNote(title, schedule) {
   try {
        let noteId = await nanoid()
        let cdate = new Date()
        let note = new Note (noteId, title, schedule)
        //{"id": noteId, "title": title, "created": cdate.toLocaleString('en-US', { timeZone: 'UTC' }), "modified": null}
        notes.set(noteId, note)
        // console.log(note)
      return note;
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

async function getNote(noteId) {
  try {
    if (notes.has(noteId)) {
      return notes.get(noteId)
    }
    return null
  } catch (err) {
    throw new Error(err)
  }
}

async function updateNote(noteId, title, schedule) {
  try {
    if (notes.has(noteId)) {
      note = notes.get(noteId)
      note._title = title
      note._schedule = schedule
      let mdate = new Date()
      note._modified = mdate.toISOString()
      notes.set(noteId, note)
  
      return true
    }
    return false
  } catch (err) {
    throw new Error(err)
  }
}

async function deleteNote(noteId) {
  try {
    if (notes.has(noteId)) {
      note = notes.get(noteId)
      notes.delete(noteId)
      return true
    }
    return false
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getNotes,
	createNote,
  getNote,
  updateNote,
  deleteNote
}
