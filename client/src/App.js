import React, { useState, useEffect } from "react";
import {
  faCalendarCheck,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./App.css";

function saveNote(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function deleteNote(url = "", data = {}) {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function App() {
  const [newNote, setNewNote] = useState("");
  const [newReminder, setReminder] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/notes")
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
      });
  }, []);

  const handleSetNewNote = (e) => {
    setNewNote(e.currentTarget.value);
  };

  const handleSetReminder = (e) => {
    setReminder(e.currentTarget.value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newNoteValue = {
      title: newNote,
    };

    if (newReminder.length > 0) {
      newNoteValue.schedule = new Date(newReminder).toISOString();
    }

    console.log(newNoteValue);
    setNewNote("");
    setReminder("");
    saveNote("http://localhost:3000/notes", newNoteValue)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        setNotes([...notes, data]);
      });
  };

  const handleDelete = (id) => () => {
    deleteNote(`http://localhost:3000/notes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        const filteredNotes = notes.filter((note) => note.id !== data.id);
        setNotes(filteredNotes);
      });
  };

  return (
    <div className="App">
      <h1>ONE NOTE</h1>
      <h2>
        <i>
          One note to rule them all, one note to find them, one note to bring
          them all
        </i>
      </h2>
      <form className="New-Note" onSubmit={handleSave}>
        <input
          name="newNote"
          placeholder="New Note Title"
          autoComplete="off"
          value={newNote}
          onChange={handleSetNewNote}
        />
        <input
          type="datetime-local"
          id="reminder"
          name="reminder"
          value={newReminder}
          onChange={handleSetReminder}
        />
        <button>Save</button>
      </form>
      <div className="Notes">
        {notes.map((note) => (
          <div key={note.id} className="Note">
            <p>{note.title}</p>
            <button>
              <FontAwesomeIcon
                icon={faCalendarCheck}
                size="2x"
                style={{ color: note.schedule ? "#4ecca3" : "#eeeeee" }}
              />
            </button>
            <button onClick={handleDelete(note.id)}>
              <FontAwesomeIcon
                icon={faTimesCircle}
                size="2x"
                style={{ color: "#eeeeee" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
