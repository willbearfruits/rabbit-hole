import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoomPage = () => {
    const [key, setKey] = useState(0); // Used to reload iframe

    const handleReload = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="w-full h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Controls Overlay */}
            <div className="absolute top-4 left-4 z-50 flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <Link to="/" className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-sm">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <button onClick={handleReload} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-sm" title="Reload Game">
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

            {/* Game Embed */}
            <iframe 
                key={key}
                src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Foriginal%2F2X%2F2%2F24b00b14f118580763d40f3a7a1c9766e3f07a3.jsdos"
                className="w-full h-full border-none"
                title="Doom (1993)"
                allow="autoplay; gamepad; keyboard-lock; fullscreen"
            />
            
            <div className="absolute bottom-4 right-4 flex flex-col items-end pointer-events-none">
                <span className="text-xs text-white/20 font-mono">IDKFA // IDDQD // DOS.ZONE</span>
                <a href="https://dos.zone/play/doom-1993" target="_blank" rel="noreferrer" className="text-[10px] text-white/10 hover:text-white/50 pointer-events-auto transition-colors">
                    If game fails to load, click here
                </a>
            </div>
        </div>
    );
};
