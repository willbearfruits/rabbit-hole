import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

const STRATEGIES = [
    "Disconnect the ground.",
    "Make it mono.",
    "What would Nam June Paik do?",
    "Destroy the most important part.",
    "Use only the errors.",
    "Amplify the background noise.",
    "Lower the sample rate until it hurts.",
    "Translate it into a format it wasn't meant for.",
    "Feed the output back into the input.",
    "Use a wrong cable.",
    "Zoom in 1000x.",
    "Remove the middle.",
    "Play it backwards at half speed.",
    "Convert image to audio, edit, convert back.",
    "Use the 'wrong' software for the job.",
    "Limit yourself to 3 colors.",
    "Turn off the screen and listen.",
    "Don't fix the bug. Feature it.",
    "What is the machine trying to say?",
    "Corrupt the header.",
    "Save it as a JPG 100 times.",
    "Force a hardware crash.",
    "Use the cheapest tool available.",
    "Make it physical.",
    "Put it in water (metaphorically... or not).",
    "Scream into the pickup.",
    "Short circuit the clock pin."
];

export const Oracle = () => {
    const [strategy, setStrategy] = useState("Consult the Oracle...");
    const [animating, setAnimating] = useState(false);

    const consult = () => {
        setAnimating(true);
        // Rapid shuffle effect
        let count = 0;
        const interval = setInterval(() => {
            setStrategy(STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)]);
            count++;
            if (count > 10) {
                clearInterval(interval);
                setAnimating(false);
            }
        }, 50);
    };

    return (
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 text-center text-white shadow-2xl border border-white/10 relative overflow-hidden group cursor-pointer" onClick={consult}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    <Sparkles className={`w-6 h-6 text-purple-200 ${animating ? 'animate-spin' : ''}`} />
                </div>
                
                <h3 className="text-xs font-bold tracking-[0.2em] text-purple-300 uppercase">Oblique Strategies</h3>
                
                <p className={`text-2xl md:text-3xl font-serif font-medium leading-tight min-h-[80px] flex items-center justify-center transition-all ${animating ? 'blur-sm scale-95' : 'blur-0 scale-100'}`}>
                    "{strategy}"
                </p>

                <span className="text-[10px] text-white/40 font-mono mt-2">CLICK_TO_DIVINE</span>
            </div>
        </div>
    );
};
