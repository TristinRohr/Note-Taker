let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Fetches notes from the server
const getNotes = async () => {
  const response = await fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  return response.json();
};

const saveNote = async (note) => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Failed to save note');
  }

  return response.json();
};

const deleteNote = async (id) => {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }

  return response.json();
};

const renderNoteList = (notes) => {
  const noteList = document.querySelector('.list-group');
  noteList.innerHTML = '';

  if (notes.length === 0) {
    noteList.innerHTML = '<li class="list-group-item">No saved Notes</li>';
  } else {
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `
        <span class="list-item-title">${note.title}</span>
        <i class="fas fa-trash-alt float-right text-danger delete-note" data-id="${note.id}"></i>
      `;
      noteList.appendChild(li);
    });
  }
};

const getAndRenderNotes = async () => {
  try {
    const notes = await getNotes();
    renderNoteList(notes);
  } catch (error) {
    alert(error.message);
  }
};

if (window.location.pathname === '/notes') {
  document.querySelector('.save-note').addEventListener('click', async () => {
    const noteTitle = document.querySelector('.note-title').value;
    const noteText = document.querySelector('.note-textarea').value;

    if (noteTitle && noteText) {
      const newNote = { title: noteTitle, text: noteText };
      await saveNote(newNote);
      await getAndRenderNotes();
    }
  });

  document.querySelector('.new-note').addEventListener('click', () => {
    document.querySelector('.note-title').value = '';
    document.querySelector('.note-textarea').value = '';
  });

  document.querySelector('.list-group').addEventListener('click', async (event) => {
    if (event.target.matches('.delete-note')) {
      const id = event.target.getAttribute('data-id');
      await deleteNote(id);
      await getAndRenderNotes();
    }
  });
}

getAndRenderNotes();