let noteTitle = document.querySelector("#noteTitle");
let noteContent = document.querySelector("#noteContent");
let searchInput = document.querySelector("#search");
let notesContainer = document.querySelector("#notesContainer");
let pageInfo = document.querySelector("#pageInfo");

let notes = JSON.parse(localStorage.getItem("notes")) || [];  //"notes" is key in local storage
let currentPage = 1;  
const notesPerPage = 10;

//new note func
function addNote(){
  let title = noteTitle.value.trim();
  let content = noteContent.value.trim();
  let now = new Date().toISOString();

  if(!content){
    alert("Content can not be empty!");
  }

  //new obj for converting to json
  const newNote = {
    id : Date.now(),  //Date.now() = milliseconds passed from jan 1, 1970
    title : title,
    content : content,
    created : now,
    updated : now,
  };

  notes.push(newNote) //adding newNote to notes array
  saveNote();
  clearInputs();
  showNotes(); //updating database
}

//saving notes to local storage
function saveNote(){
  localStorage.setItem("notes", JSON.stringify(notes));
}

//clearing input fields
function clearInputs(){
  noteTitle.value = "";
  noteContent.value = "";
}

//delete a note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNote(); //updating database
  showNotes(); 
}

let currentEditingNote = null;

function editNote(id) {
  currentEditingNote = notes.find(note => note.id == id);
  if (!currentEditingNote) return alert("Note not found!");

  document.getElementById('editTextarea').value = currentEditingNote.content;
  document.getElementById('editModal').style.display = 'block';
}

function saveEditedNote() {
  const newContent = document.getElementById('editTextarea').value;
  if (currentEditingNote) {
    currentEditingNote.content = newContent;
    saveNote();
    showNotes();
  }
  closeModal();
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}


// search notes by title
function searchNotes() {
  currentPage = 1;
  showNotes(); //updating notes cards as page is changed
}

//good look for displying date nd time
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();  //.toLocaleString() converts numbers, dates, or other values into human-readable string, formatted based on the user language and region (locale)
}


function showNotes(){
  let searchText = searchInput.value.toLowerCase();

  let filteredNotes = notes.filter(note => note.title.toLowerCase().includes(searchText));

  filteredNotes.sort((a,b) => new Date(b.updated) - new Date(a.updated));

  //telling what notes to show in a page
  const start = (currentPage - 1) * notesPerPage;
  const end = start + notesPerPage;
  const notesToShow = filteredNotes.slice(start, end);

  //adding notes from local storage in that particular page
  notesContainer.innerHTML = "";
  for(let note of notesToShow){
    const noteBox = document.createElement("div");
    noteBox.className = "note";
    noteBox.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <small>Created: ${formatDate(note.created)}</small><br>
      <small>Updated: ${formatDate(note.updated)}</small><br>
      <button onclick="deleteNote(${note.id})">Delete</button>
      <button onclick="editNote(${note.id})">Edit</button>
    `;
    notesContainer.appendChild(noteBox);
  }

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);  //Math.ceil() rounds up number
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}


//next func
function nextPage(){
  const searchText = searchInput.value.toLowerCase();
  const total = notes.filter(note => note.title.toLowerCase().includes(searchText)).length;

  if(currentPage * notesPerPage < total){
    currentPage++;
    showNotes();
  }
}

//prev func
function prevPage(){
  const searchText = searchInput.value.toLowerCase();
  const total = notes.filter(note => note.title.toLowerCase().includes(searchText)).length;
  
  if(currentPage > 1){
    currentPage--;
    showNotes();
  }
}

//display notes in html doc
showNotes();