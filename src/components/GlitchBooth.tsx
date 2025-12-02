import React, { useState } from 'react';
import { Upload, RefreshCw, Download, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const GlitchBooth = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [glitchedImage, setGlitchedImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [processing, setProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setOriginalImage(ev.target?.result as string);
        setGlitchedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const glitchImage = async () => {
    if (!originalImage) return;
    setProcessing(true);

    try {
      // Fetch the image data
      const response = await fetch(originalImage);
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
      
      // Clone data to avoid mutating original buffer
      const glitchedData = new Uint8Array(data);

      // Simple Glitch Algorithm
      // Skip header (first 500 bytes usually safe-ish for JPEG/PNG headers)
      const headerSize = 500; 
      const len = glitchedData.length;
      
      // Number of glitches based on intensity
      const glitches = Math.floor((len / 10000) * intensity);

      for (let i = 0; i < glitches; i++) {
        const loc = Math.floor(Math.random() * (len - headerSize)) + headerSize;
        glitchedData[loc] = Math.floor(Math.random() * 256);
      }

      const blob = new Blob([glitchedData], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setGlitchedImage(url);
    } catch (e) {
      console.error("Glitch failed", e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl text-slate-300 relative overflow-hidden group">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <AlertTriangle className="w-6 h-6 text-pink-500" />
                <div>
                    <h3 className="text-xl font-black text-white tracking-tighter">DATAMOSH_BOOTH_v1</h3>
                    <p className="text-xs text-slate-500 font-mono">BROWSER_BASED_BYTE_DESTRUCTION</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-pink-500/50 transition-colors bg-slate-800/50">
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="glitch-upload" />
                        <label htmlFor="glitch-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-slate-500" />
                            <span className="text-sm font-bold">Drop Image / Click to Upload</span>
                            <span className="text-xs text-slate-600">JPG/PNG only</span>
                        </label>
                    </div>

                    {originalImage && (
                        <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-slate-800">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>DESTRUCTION_LEVEL</span>
                                    <span>{intensity}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    value={intensity} 
                                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                            <Button onClick={glitchImage} className="w-full bg-pink-600 hover:bg-pink-700 text-white border-none" disabled={processing}>
                                {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                                CORRUPT_FILE
                            </Button>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="bg-black rounded-xl border border-slate-800 flex items-center justify-center min-h-[250px] relative overflow-hidden">
                    {glitchedImage ? (
                        <img src={glitchedImage} alt="Glitched" className="max-w-full max-h-[300px] object-contain hover:scale-105 transition-transform duration-75" />
                    ) : originalImage ? (
                        <img src={originalImage} alt="Original" className="max-w-full max-h-[300px] object-contain opacity-50 grayscale" />
                    ) : (
                        <div className="text-slate-700 flex flex-col items-center gap-2">
                            <ImageIcon className="w-12 h-12 opacity-20" />
                            <span className="text-xs font-mono">NO_SIGNAL_DETECTED</span>
                        </div>
                    )}
                    
                    {glitchedImage && (
                        <a href={glitchedImage} download={`glitch_${Date.now()}.jpg`} className="absolute bottom-4 right-4">
                            <Button size="sm" variant="secondary" className="shadow-xl">
                                <Download className="w-4 h-4 mr-2" /> SAVE
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
