import React, { useState, useEffect } from "react";
import {
  faCalendarCheck,
  faTimesCircle,
  faSearch,
  faSave,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./App.css";

function saveNote(url = "", data = {}) {
  if (data.id) {
    return fetch(url+data.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
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

function getNotes(url, searchString) {
  const requestUrl = url + ((searchString && searchString.length) ? "?query="+encodeURI(searchString) : "");
  return fetch(requestUrl);
}

function App() {
  const [newNote, setNewNote] = useState("");
  const [newReminder, setReminder] = useState("");
  const [notes, setNotes] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    getNotes("http://localhost:3000/notes", searchString)
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
      });
  }, [ searchString ]);

  const handleSetNewNote = (e) => {
    setNewNote(e.currentTarget.value);
  };

  const handleSetReminder = (e) => {
    setReminder(e.currentTarget.value);
  };

  const handleSetSearchString = (e) => {
    setSearchString(e.currentTarget.value);
  };

  const handleSetSelectedNoteTitle = (note) => (e) => {
    note.title = e.currentTarget.value;
    for (let i=0; i<notes.length; i++) {
      if (notes[i].id === note.id) {
        notes[i] = note;
        console.log(note);
        break;
      }
    }
    setNotes([...notes]);
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

  const handleSaveSelectedNote = (selectedNote) => (e) => {
    e.preventDefault();

    console.log(selectedNote);

    saveNote("http://localhost:3000/notes/", selectedNote)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getNotes("http://localhost:3000/notes", searchString)
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
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
      <form id="NewNoteForm" className="New-Note" onSubmit={handleSave}>
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
        <button>
          <FontAwesomeIcon
            icon={faSave}
            size="2x"
            style={{ color: "#eeeeee" }}
          />
        </button>
      </form>
      <form id="SearchNotesForm" className="Search-Notes" onSubmit={handleSearch}>
        <input
          name="searchString"
          placeholder="Search String"
          autoComplete="off"
          value={searchString}
          onChange={handleSetSearchString}
        />
        <button>
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            style={{ color: "#eeeeee" }}
          />
        </button>
      </form>
      <div className="Notes">
        {notes.map((note) => (
          <div key={note.id} className="Note">
            <input
              value={note.title}
              autoComplete="off"
              onChange={handleSetSelectedNoteTitle(note)}
            />
            <button>
              <FontAwesomeIcon
                icon={faCalendarCheck}
                size="2x"
                style={{ color: note.schedule ? "#4ecca3" : "#eeeeee" }}
              />
            </button>
            <button onClick={handleSaveSelectedNote(note)}>
              <FontAwesomeIcon
                icon={faEdit}
                size="2x"
                style={{ color: "#eeeeee" }}
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
