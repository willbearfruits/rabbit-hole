import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, BookOpen, ChevronRight, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { getTutorials, addTutorial, updateTutorial, deleteTutorial } from '../services/mockDb';
import { Tutorial } from '../types';
import { generateTutorResponse } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const TutorialsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [tags, setTags] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setTutorials(getTutorials());
  }, []);

  const refreshTutorials = () => {
    setTutorials(getTutorials());
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || !selectedTutorial) return;
    
    setLoadingAi(true);
    const resp = await generateTutorResponse(aiQuery, selectedTutorial.content, user?.settings.geminiKey);
    setAiResponse(resp);
    setLoadingAi(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDifficulty('Beginner');
    setTags('');
    setVideoUrl('');
    setContent('# New Tutorial\n\nStart writing here...');
    setShowModal(true);
  };

  const openEditModal = (tut: Tutorial) => {
    setEditingId(tut.id);
    setTitle(tut.title);
    setDifficulty(tut.difficulty);
    setTags(tut.tags.join(', '));
    setVideoUrl(tut.videoUrl || '');
    setContent(tut.content);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (editingId) {
      updateTutorial(editingId, {
        title,
        difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        tags: tagArray,
        videoUrl,
        content
      });
      // Update selected tutorial if it's the one being edited
      if (selectedTutorial?.id === editingId) {
        setSelectedTutorial(prev => prev ? { ...prev, title, difficulty: difficulty as any, tags: tagArray, videoUrl, content } : null);
      }
    } else {
      const newTut: Tutorial = {
        id: Date.now().toString(),
        title,
        difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        tags: tagArray,
        videoUrl,
        content,
        isFeatured: false
      };
      addTutorial(newTut);
    }

    refreshTutorials();
    setShowModal(false);
  };

  const handleDelete = () => {
    if (selectedTutorial && confirm(`Delete tutorial "${selectedTutorial.title}"?`)) {
      deleteTutorial(selectedTutorial.id);
      setSelectedTutorial(null);
      refreshTutorials();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex gap-6 animate-fade-in">
      {/* Sidebar */}
      <div className="w-80 hidden md:flex flex-col gap-2 overflow-y-auto pr-2 border-r border-slate-200/60">
        <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Workshops
            </h3>
            {isAdmin && (
                <button onClick={openAddModal} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-primary" title="Add Tutorial">
                    <Plus className="w-5 h-5" />
                </button>
            )}
        </div>
        <div className="space-y-1">
            {tutorials.map(tut => (
            <button
                key={tut.id}
                onClick={() => { setSelectedTutorial(tut); setAiResponse(''); setAiQuery(''); }}
                className={`w-full text-left p-3 rounded-xl transition-all group relative overflow-hidden ${
                    selectedTutorial?.id === tut.id 
                        ? 'bg-gradient-to-r from-primary to-primaryLight text-white shadow-lg shadow-red-200' 
                        : 'hover:bg-white hover:shadow-sm text-slate-600'
                }`}
            >
                <div className="flex justify-between items-start relative z-10">
                    <div className="font-semibold pr-2">{tut.title}</div>
                    {selectedTutorial?.id === tut.id && <ChevronRight className="w-4 h-4 opacity-80" />}
                </div>
                <div className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full font-medium relative z-10 ${
                    selectedTutorial?.id === tut.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                }`}>
                {tut.difficulty}
                </div>
            </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {selectedTutorial ? (
          <div className="flex flex-col h-full gap-6">
            {/* Tutorial Content */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto prose max-w-none custom-scrollbar">
              <div className="flex justify-between items-start border-b pb-4 border-slate-100 mb-6">
                  <h1 className="text-3xl font-bold text-primary m-0">{selectedTutorial.title}</h1>
                  {isAdmin && (
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEditModal(selectedTutorial)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                  )}
              </div>
              
              {selectedTutorial.videoUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg aspect-video bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedTutorial.videoUrl} 
                    title={selectedTutorial.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {(() => {
                const html = DOMPurify.sanitize(marked.parse(selectedTutorial.content) as string);
                return (
              <article
                className="tutorial-content font-sans text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: html }}
              />
                );
              })()}
            </div>

            {/* AI Assistant Panel */}
            {user?.settings.aiEnabled ? (
                <div className="bg-white border border-red-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xl shadow-red-500/5 relative z-10">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <Zap className="w-4 h-4 text-accent" />
                        AI Teaching Assistant
                    </div>
                    
                    {aiResponse && (
                        <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl text-slate-700 text-sm max-h-60 overflow-y-auto border border-red-100 shadow-inner custom-scrollbar">
                        <div className="flex gap-2">
                            <MessageSquare className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <div>
                                <React.Markdown>{aiResponse}</React.Markdown>
                            </div>
                        </div>
                        </div>
                    )}

                    <form onSubmit={handleAskAi} className="flex gap-2">
                        <input 
                        type="text" 
                        placeholder="Ask about wiring, code, or signal flow..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-sm"
                        value={aiQuery}
                        onChange={e => setAiQuery(e.target.value)}
                        />
                        <Button type="submit" isLoading={loadingAi} className="bg-primary hover:bg-primaryLight px-6 rounded-xl">
                        Ask
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-400 border border-slate-200 border-dashed">
                    AI Assistant is disabled. Enable it in <Link to="/settings" className="underline hover:text-primary font-medium">Settings</Link>.
                </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                 <BookOpen className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">Ready to Learn?</h3>
            <p className="text-slate-500 max-w-xs text-center">Select a workshop topic from the sidebar to begin your journey.</p>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Tutorial' : 'New Tutorial'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Title</label>
                    <input required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Difficulty</label>
                    <select className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Video URL (Embed Link)</label>
                <input className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Tags (comma separated)</label>
                <input className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none" value={tags} onChange={e => setTags(e.target.value)} placeholder="ESP32, Audio, Basics" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Content (Markdown)</label>
                <textarea required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none h-64 font-mono text-sm" value={content} onChange={e => setContent(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update Tutorial' : 'Save Tutorial'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
