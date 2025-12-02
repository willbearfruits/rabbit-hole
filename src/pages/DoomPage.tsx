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
                src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1"
                className="w-full h-full border-none"
                title="Doom (1993)"
                allow="autoplay; gamepad; keyboard-lock; fullscreen"
            />
            
            <div className="absolute bottom-4 right-4 text-xs text-white/20 font-mono pointer-events-none">
                IDKFA // IDDQD // DOS.ZONE
            </div>
        </div>
    );
};
