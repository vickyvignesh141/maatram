import React, { useState, useEffect } from "react";
import StudentTopBar from "../../nav/studenttop";
import API_URL from "../../../baseurl";

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
import styles from "./Stu_Bookmark.module.css";

// Add these constants at the top (you might want to move them to a config file)
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notes from backend
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/student/bookmark/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        const formatted = data.notes.map(n => ({
          id: n.note_id,
          title: n.title,
          description: n.description,
          date: n.date,
          tags: Array.isArray(n.tags) ? n.tags : [],
          lastModified: n.updated_at || n.created_at
        }));
        setNotes(formatted);
      } else {
        throw new Error(data.message || "Failed to fetch notes");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      const url = isEditing 
        ? `${API_URL}/student/bookmark/update`
        : `${API_URL}/student/bookmark/add`;
      
      const method = isEditing ? "PUT" : "POST";
      
      const body = isEditing 
        ? { ...payload, note_id: currentNote.id }
        : payload;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        fetchNotes();
        resetForm();
      } else {
        throw new Error(data.message || "Save failed");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save note: " + error.message);
    }
  };

  const handleEditNote = (note) => {
    setIsEditing(true);
    setIsAdding(true);
    setCurrentNote({
      ...note,
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : note.tags
    });
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`${API_URL}/student/bookmark/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          note_id: id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        fetchNotes();
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete note: " + error.message);
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
      e.preventDefault();
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
    if (!description) return "No description";
    return description.length > 150 ? description.substring(0, 150) + "..." : description;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.studentNotes}>
      <StudentTopBar />

      <div className={styles.notesContainer}>
        {/* Header */}
        <div className={styles.notesHeader}>
          <div className={styles.headerContent}>
            <h1>My Notes</h1>
            <p>Organize your study notes, ideas, and important information</p>
          </div>
          <button className={styles.addNoteBtn} onClick={handleAddNote}>
            <Plus size={20} />
            Add New Note
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchNotes}>Retry</button>
          </div>
        )}

        {/* Add/Edit Note Form */}
        {isAdding && (
          <div className={styles.noteFormContainer}>
            <div className={styles.noteForm}>
              <div className={styles.formHeader}>
                <h3>{isEditing ? "Edit Note" : "Create New Note"}</h3>
                <div className={styles.formActions}>
                  <button className={styles.btnSecondary} onClick={handleCancel}>
                    <X size={18} />
                    Cancel
                  </button>
                  <button className={styles.btnPrimary} onClick={handleSaveNote}>
                    <Save size={18} />
                    {isEditing ? "Update Note" : "Save Note"}
                  </button>
                </div>
              </div>

              <div className={styles.formContent}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">
                    Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                    placeholder="Enter note title"
                    maxLength={100}
                  />
                  <div className={styles.charCount}>
                    {currentNote.title.length}/100
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={currentNote.description}
                    onChange={(e) => setCurrentNote({...currentNote, description: e.target.value})}
                    placeholder="Write your note content here..."
                    rows={8}
                  />
                  <div className={styles.charCount}>
                    {currentNote.description.length} characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className={styles.notesControls}>
          <div className={styles.searchContainer}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search notes by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.controlsRight}>
            <div className={styles.sortContainer}>
              <span className={styles.sortLabel}>Sort by:</span>
              <div className={styles.sortOptions}>
                <button 
                  className={`${styles.sortBtn} ${sortBy === 'date' ? styles.active : ''}`}
                  onClick={() => handleSort('date')}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
                <button 
                  className={`${styles.sortBtn} ${sortBy === 'title' ? styles.active : ''}`}
                  onClick={() => handleSort('title')}
                >
                  Title {sortBy === 'title' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
              </div>
            </div>

            {(searchTerm || selectedTags.length > 0) && (
              <button className={styles.clearFilters} onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className={styles.tagsFilter}>
            <div className={styles.tagsHeader}>
              <Tag size={18} />
              <span>Filter by Tags:</span>
            </div>
            <div className={styles.tagsList}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagBtn} ${selectedTags.includes(tag) ? styles.active : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X size={12} />}
                </button>
              ))}
            </div>
            <div className={styles.addTagInput}>
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

        {/* Loading State */}
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading notes...</p>
          </div>
        ) : (
          <>
            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <div className={styles.emptyNotes}>
                <FileText size={64} />
                <h3>No notes found</h3>
                <p>
                  {searchTerm || selectedTags.length > 0 
                    ? "Try changing your search or filter criteria"
                    : "Create your first note to get started"}
                </p>
                {!isAdding && (
                  <button className={styles.btnPrimary} onClick={handleAddNote}>
                    <Plus size={20} />
                    Create Your First Note
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={styles.notesSummary}>
                  <span className={styles.notesCount}>
                    {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
                  </span>
                  <span className={styles.notesInfo}>
                    <Clock size={14} />
                    Last modified: {formatDate(notes[0]?.lastModified || new Date())}
                  </span>
                </div>

                <div className={styles.notesGrid}>
                  {filteredNotes.map(note => (
                    <div key={note.id} className={styles.noteCard}>
                      <div className={styles.noteHeader}>
                        <div className={styles.noteTitle}>
                          <h3>{note.title}</h3>
                          {note.tags && note.tags.length > 0 && (
                            <div className={styles.noteTags}>
                              {note.tags.slice(0, 3).map(tag => (
                                <span key={tag} className={styles.noteTag}>
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 3 && (
                                <span className={styles.noteTagMore}>
                                  +{note.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className={styles.noteActions}>
                          <button 
                            className={`${styles.iconBtn} ${styles.edit}`}
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className={`${styles.iconBtn} ${styles.delete}`}
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className={styles.noteContent}>
                        <p>{getNoteSummary(note.description)}</p>
                      </div>

                      <div className={styles.noteFooter}>
                        <div className={styles.noteDate}>
                          <Calendar size={14} />
                          {formatDate(note.date)}
                        </div>
                        <div className={styles.noteLength}>
                          {note.description?.length || 0} characters
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}