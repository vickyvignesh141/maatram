import React, { useState, useEffect } from "react";
import StudentTopBar from "../../nav/studenttop";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Calendar, 
  Search,
  FileText,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp
} from "lucide-react";
//import "./Stu_Bookmark.css";

// Add these constants at the top (you might want to move them to a config file)
const API_BASE = "http://localhost:5000/api"; // Adjust based on your backend URL
const username = "student_username"; // You should get this from auth context or localStorage

export default function StudentNotes() {
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    description: "",
    tags: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Fetch notes from backend
  const fetchNotes = () => {
    fetch(`${API_BASE}/student/bookmark/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.notes.map(n => ({
            id: n.note_id,
            title: n.title,
            description: n.description,
            date: n.date,
            tags: n.tags || [],
            lastModified: n.updated_at || n.created_at
          }));
          setNotes(formatted);
        }
      })
      .catch(err => console.error(err));
  };

  // Load notes from backend on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter and sort notes whenever notes, searchTerm, sortBy, sortOrder, or selectedTags change
  useEffect(() => {
    let result = notes;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(note =>
        note.title.toLowerCase().includes(term) ||
        note.description.toLowerCase().includes(term) ||
        note.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    // Sort notes
    result = [...result].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "date":
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredNotes(result);
  }, [notes, searchTerm, sortBy, sortOrder, selectedTags]);

  // Get all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  const handleAddNote = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentNote({
      id: null,
      title: "",
      description: "",
      tags: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveNote = async () => {
    if (!currentNote.title.trim()) {
      alert("Please enter a title");
      return;
    }

    const tagsArray = currentNote.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    const payload = {
      username,
      title: currentNote.title,
      description: currentNote.description,
      date: currentNote.date,
      tags: tagsArray
    };

    try {
      if (isEditing) {
        await fetch(`${API_BASE}/student/bookmark/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            note_id: currentNote.id
          })
        });
      } else {
        await fetch(`${API_BASE}/student/bookmark/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      fetchNotes();
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save note");
    }
  };

  const handleEditNote = (note) => {
    setIsEditing(true);
    setIsAdding(true);
    setCurrentNote({
      ...note,
      tags: note.tags.join(", ")
    });
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await fetch(`${API_BASE}/student/bookmark/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          note_id: id
        })
      });

      fetchNotes();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete note");
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentNote({
      id: null,
      title: "",
      description: "",
      tags: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addNewTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput("");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSortBy("date");
    setSortOrder("desc");
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getNoteSummary = (description) => {
    return description.length > 150 ? description.substring(0, 150) + "..." : description;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="student-notes">
      <StudentTopBar />

      <div className="notes-container">
        {/* Header */}
        <div className="notes-header">
          <div className="header-content">
            <h1>My Notes</h1>
            <p>Organize your study notes, ideas, and important information</p>
          </div>
          <button className="add-note-btn" onClick={handleAddNote}>
            <Plus size={20} />
            Add New Note
          </button>
        </div>

        {/* Add/Edit Note Form */}
        {isAdding && (
          <div className="note-form-container">
            <div className="note-form">
              <div className="form-header">
                <h3>{isEditing ? "Edit Note" : "Create New Note"}</h3>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={handleCancel}>
                    <X size={18} />
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveNote}>
                    <Save size={18} />
                    {isEditing ? "Update Note" : "Save Note"}
                  </button>
                </div>
              </div>

              <div className="form-content">
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                    placeholder="Enter note title"
                    maxLength={100}
                  />
                  <div className="char-count">
                    {currentNote.title.length}/100
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">
                      <Calendar size={16} />
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={currentNote.date}
                      onChange={(e) => setCurrentNote({...currentNote, date: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags">
                      <Tag size={16} />
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={currentNote.tags}
                      onChange={(e) => setCurrentNote({...currentNote, tags: e.target.value})}
                      placeholder="e.g., math, physics, important"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={currentNote.description}
                    onChange={(e) => setCurrentNote({...currentNote, description: e.target.value})}
                    placeholder="Write your note content here..."
                    rows={8}
                  />
                  <div className="char-count">
                    {currentNote.description.length} characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="notes-controls">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notes by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="controls-right">
            <div className="sort-container">
              <span className="sort-label">Sort by:</span>
              <div className="sort-options">
                <button 
                  className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => handleSort('date')}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
                <button 
                  className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() => handleSort('title')}
                >
                  Title {sortBy === 'title' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
              </div>
            </div>

            {(searchTerm || selectedTags.length > 0) && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="tags-filter">
            <div className="tags-header">
              <Tag size={18} />
              <span>Filter by Tags:</span>
            </div>
            <div className="tags-list">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X size={12} />}
                </button>
              ))}
            </div>
            <div className="add-tag-input">
              <input
                type="text"
                placeholder="Add custom tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={addNewTag}
              />
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="empty-notes">
            <FileText size={64} />
            <h3>No notes found</h3>
            <p>
              {searchTerm || selectedTags.length > 0 
                ? "Try changing your search or filter criteria"
                : "Create your first note to get started"}
            </p>
            {!isAdding && (
              <button className="btn-primary" onClick={handleAddNote}>
                <Plus size={20} />
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="notes-summary">
              <span className="notes-count">{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found</span>
              <span className="notes-info">
                <Clock size={14} />
                Last modified: {formatDate(notes[0]?.lastModified || new Date())}
              </span>
            </div>

            <div className="notes-grid">
              {filteredNotes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <div className="note-title">
                      <h3>{note.title}</h3>
                      {note.tags.length > 0 && (
                        <div className="note-tags">
                          {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="note-tag">
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="note-tag-more">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="note-actions">
                      <button 
                        className="icon-btn edit"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="icon-btn delete"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="note-content">
                    <p>{getNoteSummary(note.description)}</p>
                  </div>

                  <div className="note-footer">
                    <div className="note-date">
                      <Calendar size={14} />
                      {formatDate(note.date)}
                    </div>
                    <div className="note-length">
                      {note.description.length} characters
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}