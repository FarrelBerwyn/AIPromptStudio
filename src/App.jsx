import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Sparkles, 
  Mic2, 
  Image as ImageIcon, 
  Video, 
  Copy, 
  Download, 
  Loader2,
  Moon,
  Sun,
  ChevronDown,
  Check
} from 'lucide-react';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Form States
  const [voiceParams, setVoiceParams] = useState({
    jenis: 'Pria Dewasa',
    kualitas: 'Studio HD',
    aksen: 'Indonesia (Jakarta)',
    tempo: 'Normal',
    nada: 'Ramah',
    intonasi: 'Ekspresif'
  });

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'image') setImage(event.target.result);
        if (type === 'video') setVideo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    if (type === 'image') setImage(null);
    if (type === 'video') setVideo(null);
  };

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const copyToClipboard = () => {
    const text = `AI Prompt Studio Data:\nImage: ${image ? 'Attached' : 'None'}\nVideo: ${video ? 'Attached' : 'None'}\nInstruction: ${instruction}\nVoice: ${JSON.stringify(voiceParams)}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadFile = (format) => {
    const data = {
      timestamp: new Date().toISOString(),
      instruction,
      parameters: voiceParams,
      hasImage: !!image,
      hasVideo: !!video
    };
    
    const content = format === 'json' 
      ? JSON.stringify(data, null, 2) 
      : `AI PROMPT STUDIO REPORT\n\nInstruksi: ${instruction}\nParameter Suara: ${Object.entries(voiceParams).map(([k, v]) => `${k}: ${v}`).join(', ')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-studio-export.${format}`;
    link.click();
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'} min-h-screen transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100`}>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AI Prompt Studio</h1>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-screen pt-24 pb-40 overflow-x-hidden">
        
        {/* Step 1: Upload Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 px-6">
          {/* Image Upload */}
          <div className="group flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Referensi Subjek (Gambar)</label>
            <div className="relative h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500/50 transition-all overflow-hidden flex flex-col items-center justify-center p-4">
              {image ? (
                <>
                  <img src={image} className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-300" alt="Preview" />
                  <button onClick={() => removeFile('image')} className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-medium mb-1">Drag & drop gambar</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WebP up to 10MB</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="group flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Referensi Aksi/Kamera (Video)</label>
            <div className="relative h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col items-center justify-center p-4">
              {video ? (
                <>
                  <video src={video} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <button onClick={() => removeFile('video')} className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors">
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white uppercase tracking-wider font-bold">Preview Thumbnail</div>
                </>
              ) : (
                <div className="text-center group-hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Video size={24} />
                  </div>
                  <p className="text-sm font-medium mb-1">Upload video referensi</p>
                  <p className="text-xs text-slate-400">MP4, MOV up to 50MB</p>
                  <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Parameters */}
        <section className="space-y-10 px-6">
          {/* Textarea */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Instruksi Tambahan (Opsional)</label>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${instruction.length > 450 ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {instruction.length} / 500
              </span>
            </div>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value.slice(0, 500))}
              placeholder="Berikan arahan spesifik tentang pencahayaan, mood, atau detail gerakan..."
              className="w-full h-32 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Grid Dropdown 3x2 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 ml-1">
              <Mic2 size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold uppercase tracking-widest opacity-70">Detail Suara & Dialog</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Jenis', key: 'jenis', opts: ['Pria Dewasa', 'Wanita Dewasa', 'Remaja', 'Narator'] },
                { label: 'Kualitas', key: 'kualitas', opts: ['Studio HD', 'Telepon', 'Radio', 'Natural'] },
                { label: 'Aksen', key: 'aksen', opts: ['Indonesia (Jakarta)', 'Melayu', 'British', 'American'] },
                { label: 'Tempo', key: 'tempo', opts: ['Sangat Lambat', 'Normal', 'Cepat', 'Dinamis'] },
                { label: 'Nada', key: 'nada', opts: ['Ramah', 'Serius', 'Ceria', 'Bisikan'] },
                { label: 'Intonasi', key: 'intonasi', opts: ['Datar', 'Ekspresif', 'Bertanya', 'Tegas'] }
              ].map((item) => (
                <div key={item.key} className="relative group">
                  <label className="text-[10px] uppercase tracking-tighter font-bold text-slate-400 absolute top-2.5 left-4 z-10 pointer-events-none">{item.label}</label>
                  <select 
                    value={voiceParams[item.key]}
                    onChange={(e) => setVoiceParams({...voiceParams, [item.key]: e.target.value})}
                    className="w-full h-14 pl-4 pr-10 pt-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all"
                  >
                    {item.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 w-full p-4 md:p-6 pointer-events-none">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl pointer-events-auto mx-6">
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={copyToClipboard}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
            >
              {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>
            <div className="flex gap-2 flex-1 md:flex-none">
              <button onClick={() => downloadFile('txt')} className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center" title="Unduh TXT">
                <Download size={16} />
              </button>
              <button onClick={() => downloadFile('json')} className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-[10px]">
                JSON
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-72 relative overflow-hidden group py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>GENERATE VIDEO</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
        </div>
      </footer>

      {/* Global Glass Overlay for Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-white/10 dark:bg-slate-950/10 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="relative">
               <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-500 animate-spin" />
               <Sparkles className="absolute inset-0 m-auto text-indigo-500 animate-pulse" />
            </div>
            <p className="font-bold text-lg animate-pulse tracking-tight">Menghasilkan Karya...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        select::-webkit-scrollbar {
          width: 8px;
        }
        select::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
