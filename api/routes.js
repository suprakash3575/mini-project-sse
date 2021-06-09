var express = require('express')
var router = express.Router()
const db = require('./db.js')


router.post('/notes',async function(req, resp) {
	try {
		let title = req.body.title
		if (title) {
			if (title.length <= 200) {
				// Is there a schedule defined for the note?
				if (req.body.schedule) {
					// If its in a  valid ISO 8601 format, then create the note
					let parsedDate = new Date(req.body.schedule)
					if (parsedDate.getTime() == parsedDate.getTime()) {
						let note = await db.createNote(title, parsedDate.toISOString())
						return resp.json(note)
					}
					return resp.status(400).json("Invalid Date time specified for Schedule")
				}
				// Empty schedule, update only the title
				else {
					let note = await db.createNote(title, req.body.schedule)
					return resp.json(note)
				}
			}
			return resp.status(400).json("Max length cannot exceed 200 characters. Currently " + title.length)
		}
		resp.status(400).json("Title cannot be empty and has to be 1 and 200 characters")
	} catch (error) {
		console.log(error)
		resp.status(500).json(error);
	}

})

router.get('/notes', async function(req, resp) {
	try {
		queryfilter = req.query.query
		console.log(queryfilter)
		let notes = await db.getNotes(queryfilter)
		r = JSON.stringify(Array.from(notes.values()))
		return resp.send(r)
	} catch (error) {
		console.log(error)
		resp.status(500).json(error);
	}

})

router.get('/notes/:id', async function(req, resp) {
	try {
		let noteId = req.params.id;
		let note = await db.getNote(noteId)
		if (note)
			return resp.json(note)
		resp.status(404).json("Note " + noteId + " not found")
	} catch (error) {
		console.log(error)
		resp.status(500).json(error);
	}
})

router.put('/notes/:id', async function(req, resp) {
	try {
		let noteId = req.params.id;
		let title = req.body.title
		if (title) {
			if (title.length <= 200) {
				// Check if schdule is defined for the note
				if (req.body.schedule) {
					let parsedDate = new Date(req.body.schedule)
					if (parsedDate.getTime() == parsedDate.getTime()) {
						result = await db.updateNote(noteId, title, parsedDate.toISOString())
						if (result)
							return resp.json('Success!')
						// return 404 for invalid note Id
						return resp.status(404).json("Note " + noteId + " not found")
					}
					return resp.status(400).json("Invalid Date time specified for Schedule")
				}
				// Empty schedule
				else {
					result = await db.updateNote(noteId, title, req.body.schedule)
					if (result)
						return resp.json('Success!')
					// return 404 for invalid note Id
					return resp.status(404).json("Note " + noteId + " not found")
				}
				
			}
			return resp.status(400).json("Max length cannot exceed 200 characters. Currrently " + title.length)
		}

		// Empty title - Ignore Update
		resp.json('Title was empty. Nothing updated')
	} catch (error) {
		console.log(error)
		resp.status(500).json(error);
	}
})

router.delete('/notes/:id', async function(req, resp) {
	try {
		let noteId = req.params.id;
		result = await db.deleteNote(noteId)
		if (result)
			return resp.json('Success')
		resp.status(404).json("Note " + noteId + " not found")
	} catch (error) {
		console.log(error)
		resp.status(500).json(error);
	}
})

module.exports = router