import React, { useState } from 'react';
import { Zap, Lock, Save, Download, Database } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { exportDatabase } from '../services/mockDb';

export const SettingsPage = () => {
    const { user, updateSettings } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [aiEnabled, setAiEnabled] = useState(user?.settings.aiEnabled || false);
    const [geminiKey, setGeminiKey] = useState(user?.settings.geminiKey || '');
    const [openaiKey, setOpenaiKey] = useState(user?.settings.openaiKey || '');
    const [claudeKey, setClaudeKey] = useState(user?.settings.claudeKey || '');
    const [githubToken, setGithubToken] = useState(user?.settings.githubToken || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!user) return;
        updateSettings({
            aiEnabled,
            geminiKey,
            openaiKey,
            claudeKey,
            githubToken
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleExport = () => {
        const data = exportDatabase();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'database.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">User Settings</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
                {/* AI Settings */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-red-50/50 to-transparent">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-accent" /> AI Lab Assistant
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                        <div className="pr-8">
                            <label className="text-slate-800 font-medium block mb-1">Enable AI Tutor in Workshops</label>
                            <p className="text-sm text-slate-500">
                                When enabled, an AI chat interface will appear in the tutorial section to help with code and circuit debugging. 
                            </p>
                        </div>
                        <button 
                            onClick={() => setAiEnabled(!aiEnabled)}
                            className={`shrink-0 w-14 h-8 rounded-full transition-colors relative shadow-inner ${aiEnabled ? 'bg-accent' : 'bg-slate-200'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-all ${aiEnabled ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>

                {/* API Keys */}
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-3 h-3" /> API Keys
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                    value={geminiKey} 
                                    onChange={e => setGeminiKey(e.target.value)} 
                                    placeholder="AIza..." 
                                />
                                <p className="text-xs text-slate-400 mt-2">Required for the AI Tutor feature.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Personal Access Token</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                    value={githubToken} 
                                    onChange={e => setGithubToken(e.target.value)} 
                                    placeholder="ghp_..." 
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    Required for <strong>Auto-Save</strong>. Create a token with 'repo' scope at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-accent underline">GitHub Settings</a>.
                                </p>
                            </div>
                            <div className="opacity-60 pointer-events-none grayscale">
                                <label className="block text-sm font-medium text-slate-700 mb-1">ChatGPT API Key (Coming Soon)</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50" 
                                    value={openaiKey} 
                                    onChange={e => setOpenaiKey(e.target.value)} 
                                    placeholder="sk-..." 
                                    disabled 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Section */}
                {isAdmin && (
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-slate-500" /> Content Management
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-slate-800 font-medium block mb-1">Export Database</label>
                                <p className="text-sm text-slate-500 max-w-md">
                                    Download your local edits as a JSON file. Commit this file to <code>public/database.json</code> in the repository to publish changes to all students.
                                </p>
                            </div>
                            <Button variant="secondary" onClick={handleExport}>
                                <Download className="w-4 h-4 mr-2" /> Download JSON
                            </Button>
                        </div>
                    </div>
                )}

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <Button onClick={handleSave} className="w-40 shadow-lg shadow-red-200">
                        {saved ? 'Settings Saved!' : (
                            <>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
