import React, { useState, useEffect } from 'react';
import { Check, X, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from './Button';

const COLORS = [
  { name: 'Black', value: 0, hex: '#000000', text: 'white' },
  { name: 'Brown', value: 1, hex: '#8B4513', text: 'white' },
  { name: 'Red', value: 2, hex: '#DC2626', text: 'white' },
  { name: 'Orange', value: 3, hex: '#EA580C', text: 'white' },
  { name: 'Yellow', value: 4, hex: '#FACC15', text: 'black' },
  { name: 'Green', value: 5, hex: '#16A34A', text: 'white' },
  { name: 'Blue', value: 6, hex: '#2563EB', text: 'white' },
  { name: 'Violet', value: 7, hex: '#7C3AED', text: 'white' },
  { name: 'Grey', value: 8, hex: '#9CA3AF', text: 'black' },
  { name: 'White', value: 9, hex: '#FFFFFF', text: 'black' },
];

const generateResistor = () => {
    const b1 = Math.floor(Math.random() * 9) + 1; // 1-9 (First band can't be 0)
    const b2 = Math.floor(Math.random() * 10);
    const mVal = Math.floor(Math.random() * 7); // 0-6
    const multiplier = Math.pow(10, mVal);
    
    const value = (b1 * 10 + b2) * multiplier;
    
    return {
        bands: [b1, b2, mVal], // Indices in COLORS
        value
    };
};

export const ResistorQuiz: React.FC = () => {
    const [target, setTarget] = useState(generateResistor());
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    useEffect(() => {
        generateOptions(target.value);
    }, [target]);

    const generateOptions = (correct: number) => {
        const opts = new Set<number>();
        opts.add(correct);
        while (opts.size < 4) {
            // Generate wrong answers that look plausible (same magnitude or similar digits)
            const r = Math.random();
            if (r > 0.5) {
                // Wrong multiplier
                opts.add(correct * 10);
                opts.add(correct / 10);
            } else {
                // Random resistor
                opts.add(generateResistor().value);
            }
        }
        // Sort randomly
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5).slice(0, 4));
    };

    const formatValue = (val: number) => {
        if (val >= 1000000) return `${val / 1000000}MΩ`;
        if (val >= 1000) return `${val / 1000}kΩ`;
        return `${val}Ω`;
    };

    const handleGuess = (val: number) => {
        if (status !== 'idle') return;
        
        if (val === target.value) {
            setStatus('correct');
            setScore(s => s + 100 + (streak * 10));
            setStreak(s => s + 1);
            setTimeout(() => {
                setTarget(generateResistor());
                setStatus('idle');
            }, 1000);
        } else {
            setStatus('wrong');
            setStreak(0);
            setTimeout(() => {
                setStatus('idle');
            }, 1000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" /> Resistor Quiz
                    </h3>
                    <p className="text-xs text-slate-500">Guess the value!</p>
                </div>
                <div className="text-right">
                    <div className="font-mono font-bold text-accent">{score} pts</div>
                    <div className="text-xs text-slate-400">Streak: {streak}🔥</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                {/* Resistor Visual */}
                <div className="relative w-full h-24 bg-[#fef3c7] rounded-full flex items-center justify-center shadow-inner border border-[#d4d4d4] overflow-hidden max-w-xs">
                    {/* Wires */}
                    <div className="absolute -left-4 w-8 h-2 bg-gray-400"></div>
                    <div className="absolute -right-4 w-8 h-2 bg-gray-400"></div>
                    
                    {/* Bands */}
                    <div className="flex gap-4 md:gap-6 z-10">
                        <div className="w-4 h-24" style={{ backgroundColor: COLORS[target.bands[0]].hex }}></div>
                        <div className="w-4 h-24" style={{ backgroundColor: COLORS[target.bands[1]].hex }}></div>
                        <div className="w-4 h-24" style={{ backgroundColor: COLORS[target.bands[2]].hex }}></div>
                        <div className="w-4 h-24 ml-4" style={{ backgroundColor: '#FFD700' }}></div> {/* Gold Tol */}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleGuess(opt)}
                            disabled={status !== 'idle'}
                            className={`py-3 rounded-lg font-mono font-bold transition-all transform active:scale-95
                                ${status === 'idle' 
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                                    : opt === target.value 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-red-100 text-red-300 opacity-50'
                                }
                            `}
                        >
                            {formatValue(opt)}
                        </button>
                    ))}
                </div>
                
                {status === 'correct' && <div className="text-green-600 font-bold animate-bounce">Correct!</div>}
                {status === 'wrong' && <div className="text-red-500 font-bold">Wrong!</div>}
            </div>
        </div>
    );
};
