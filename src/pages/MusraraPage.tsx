import React from 'react';
import { Wrench, Terminal, Image, Video, Brain, ExternalLink, Download, Code, Zap } from 'lucide-react';
import { Button } from '../components/Button';

export const MusraraPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Musrara</span> Toolkit
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Curated digital weaponry for New Media students. 
          Everything you need to bend data, generate chaos, and build the future.
        </p>
      </div>

      {/* Section 1: Essential Software */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Essential Software</h2>
            <p className="text-slate-500 text-sm">The standard issue survival kit.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SoftwareCard 
                title="Avidemux" 
                desc="Simple video cutter and encoder. The 'Swiss Army Knife' of video glitching."
                url="http://avidemux.sourceforge.net/"
                icon={<Video className="w-5 h-5 text-blue-500" />}
            />
            <SoftwareCard 
                title="Hex Fiend" 
                desc="MacOS Hex Editor. Essential for databending raw files."
                url="https://hexfiend.com/"
                icon={<Code className="w-5 h-5 text-slate-700" />}
                platform="Mac"
            />
            <SoftwareCard 
                title="HxD" 
                desc="Windows Hex Editor. Robust and fast."
                url="https://mh-nexus.de/en/hxd/"
                icon={<Code className="w-5 h-5 text-slate-700" />}
                platform="Win"
            />
             <SoftwareCard 
                title="Audacity" 
                desc="The open-source audio editor. Waveform destruction guaranteed."
                url="https://www.audacityteam.org/"
                icon={<ExternalLink className="w-5 h-5 text-orange-500" />}
            />
             <SoftwareCard 
                title="GIMP" 
                desc="GNU Image Manipulation Program. Photoshop, but free and scriptable."
                url="https://www.gimp.org/"
                icon={<Image className="w-5 h-5 text-green-600" />}
            />
        </div>
      </section>

      {/* Section 2: CLI Agents */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
            <div className="p-3 bg-slate-800 rounded-xl text-white">
                <Terminal className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Command Line Tools</h2>
                <p className="text-slate-500 text-sm">Code faster directly from your terminal.</p>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm shadow-xl overflow-hidden relative group">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Terminal className="w-12 h-12" />
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-purple-400 font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Gemini CLI (Unofficial/SDK)
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">Install the Google GenAI SDK to build your own tools:</p>
                    <div className="bg-black/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                        <code>npm install -g @google/generative-ai</code>
                        <CopyButton text="npm install -g @google/generative-ai" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-orange-400 font-bold flex items-center gap-2">
                        <Brain className="w-4 h-4" /> Claude Code
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">Anthropic's new agentic coding tool:</p>
                    <div className="bg-black/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                        <code>npm install -g @anthropic-ai/claude-code</code>
                        <CopyButton text="npm install -g @anthropic-ai/claude-code" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-blue-400 font-bold flex items-center gap-2">
                        <Code className="w-4 h-4" /> GitHub Copilot CLI (Codex)
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">The official CLI extension for GitHub Copilot:</p>
                    <div className="bg-black/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                        <code>gh extension install github/gh-copilot</code>
                        <CopyButton text="gh extension install github/gh-copilot" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Section 3: Generative Media */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
            <div className="p-3 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl text-white">
                <Image className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Generative Media</h2>
                <p className="text-slate-500 text-sm">Image, Video, and Audio synthesis.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResourceLink 
                title="Leonardo.ai" 
                desc="High-quality artistic image generation with fine-tuned models."
                url="https://leonardo.ai/"
                tag="Image"
            />
             <ResourceLink 
                title="Google ImageFX (Imagen 3)" 
                desc="Google's latest photorealistic image model. Fast and high fidelity."
                url="https://aitestkitchen.withgoogle.com/tools/image-fx"
                tag="Image"
            />
             <ResourceLink 
                title="RunwayML" 
                desc="The gold standard for AI video generation (Gen-2, Gen-3)."
                url="https://runwayml.com/"
                tag="Video"
            />
             <ResourceLink 
                title="Pika Labs" 
                desc="Text-to-video and image-to-video generation. Great for animation."
                url="https://pika.art/"
                tag="Video"
            />
             <ResourceLink 
                title="HuggingChat" 
                desc="Open-source alternative to ChatGPT. Access Llama 3, Mistral, etc."
                url="https://huggingface.co/chat/"
                tag="LLM"
            />
             <ResourceLink 
                title="Google Project IDX" 
                desc="Browser-based full-stack IDE with AI assistance. (Firebase Studio)."
                url="https://idx.google.com/"
                tag="Dev"
            />
        </div>
      </section>

    </div>
  );
};

// Helper Components

const SoftwareCard = ({ title, desc, url, icon, platform }: any) => (
    <a href={url} target="_blank" rel="noreferrer" className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-purple-50 transition-colors">
                {icon}
            </div>
            {platform && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                    {platform}
                </span>
            )}
        </div>
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
            {title}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </a>
);

const ResourceLink = ({ title, desc, url, tag }: any) => (
    <a href={url} target="_blank" rel="noreferrer" className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all group">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-1 rounded-full border border-pink-100">
                {tag}
            </span>
            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-pink-400 transition-colors" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
    </a>
);

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = React.useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleCopy} 
            className="text-xs text-slate-500 hover:text-white transition-colors p-2"
            title="Copy to clipboard"
        >
            {copied ? '✓' : 'Copy'}
        </button>
    );
};
