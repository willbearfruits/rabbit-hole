import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Activity } from 'lucide-react';
import { Button } from './Button';

export const ToneGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState(0.5);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    // Initialize Audio Context
    return () => {
      stopTone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current!.currentTime);
    }
  }, [frequency]);

  useEffect(() => {
    if (oscRef.current) {
        // Waveform change requires recreating oscillator in some implementations, 
        // but standard API allows type change.
        oscRef.current.type = waveform;
    }
  }, [waveform]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current!.currentTime, 0.01);
    }
  }, [volume]);

  const startTone = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    // Nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyzer = ctx.createAnalyser();

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    analyzer.fftSize = 2048;

    // Connect: Osc -> Gain -> Analyzer -> Dest
    osc.connect(gain);
    gain.connect(analyzer);
    analyzer.connect(ctx.destination);

    osc.start();
    
    oscRef.current = osc;
    gainRef.current = gain;
    analyzerRef.current = analyzer;
    setIsPlaying(true);
    draw();
  };

  const stopTone = () => {
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) stopTone();
    else startTone();
  };

  const draw = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const render = () => {
      if (!isPlaying) return;
      animationRef.current = requestAnimationFrame(render);
      
      analyzerRef.current!.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ef4444'; // accent color
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if(i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    render();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-bold text-slate-800">Signal Generator</h3>
      </div>

      <div className="mb-6 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={150} 
            className="w-full h-32 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waveform</label>
                <div className="flex rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => setWaveform(type)}
                            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${waveform === type ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency: {frequency} Hz</label>
                <input 
                    type="range" 
                    min="20" 
                    max="2000" 
                    step="1" 
                    value={frequency} 
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>20 Hz</span>
                    <span>2 kHz</span>
                </div>
            </div>
        </div>

        <div className="space-y-4 flex flex-col justify-center">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Volume
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <Button 
                onClick={togglePlay} 
                variant={isPlaying ? 'danger' : 'primary'} 
                className="w-full py-4 text-lg shadow-lg shadow-red-200"
            >
                {isPlaying ? (
                    <><Pause className="w-5 h-5 mr-2" /> Stop Signal</>
                ) : (
                    <><Play className="w-5 h-5 mr-2" /> Generate Signal</>
                )}
            </Button>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center">
        Use this to test your filters or simply annoy your roommates.
      </p>
    </div>
  );
};
