import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Globe, Copy, Check, Heart, Trash2, 
  Settings, ChevronDown, ChevronUp, RefreshCw, Award, 
  BookOpen, Eye, Edit2, ArrowRight, Bookmark, AlertCircle, Info, Send 
} from 'lucide-react';
import { 
  Platform, Tone, CopywritingFramework, CaptionLength, Language, 
  GenerationResponse, GeneratedCaption, SavedCaption 
} from './types';
import TemplatePrompts from './components/TemplatePrompts';
import PlatformMockup from './components/PlatformMockup';
import MixMatchSection from './components/MixMatchSection';

export default function App() {
  // Configurable states
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [tone, setTone] = useState<Tone>('aesthetic');
  const [framework, setFramework] = useState<CopywritingFramework>('hook-body-cta');
  const [length, setLength] = useState<CaptionLength>('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [hashtagCount, setHashtagCount] = useState(6);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [language, setLanguage] = useState<Language>('id');
  
  // App UI & Generation states
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [response, setResponse] = useState<GenerationResponse | null>(null);
  const [activeCaptionText, setActiveCaptionText] = useState('');
  const [username, setUsername] = useState('brand_creator.co');
  const [savedCaptions, setSavedCaptions] = useState<SavedCaption[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favoritedId, setFavoritedId] = useState<string | null>(null);

  // Load saved captions from local storage on mount
  useEffect(() => {
    try {
      const persisted = localStorage.getItem('caption_generator_favorites');
      if (persisted) {
        setSavedCaptions(JSON.parse(persisted));
      }
    } catch (_) {}
  }, []);

  // Save to local storage on modification
  const saveFavoritesToLocalStorage = (list: SavedCaption[]) => {
    try {
      localStorage.setItem('caption_generator_favorites', JSON.stringify(list));
    } catch (_) {}
  };

  // Pre-populate default caption when app starts so that the mockup isn't empty
  useEffect(() => {
    if (!activeCaptionText) {
      if (language === 'id') {
        setActiveCaptionText(
          "🌟 Menghadirkan petualangan rasa baru di tengah kesibukan harimu! ☕️✨ Dirancang khusus dengan material ramah lingkungan berkualitas tinggi untuk menjaga kopi pagi Anda tetap hangat lebih lama.\n\nDapatkan koleksi mug keramik handmade premium kami melalui link di bio. Stok terbatas! 🛒🍃\n\n#KerajinanLokal #MugEstetik #KopiPagi #ProdukRamahLingkungan"
        );
      } else {
        setActiveCaptionText(
          "🌟 Elevate your everyday coffee rituals with our brand new collection! ☕️✨ Handcrafted with highly-durable, eco-friendly ceramic material to keep your favorite brews hot all morning.\n\nSecure your custom-made mug now before we run out of stock. Link in bio! 🛒🍃\n\n#AestheticLiving #CoffeeEnthusiast #HandmadeMug #MinimalistVibes"
        );
      }
    }
  }, [language]);

  // Handle template selection
  const handleSelectTemplate = (chosenTopic: string) => {
    setTopic(chosenTopic);
  };

  // Perform API call to Express backend
  const handleGenerate = async () => {
    if (!topic || topic.trim() === '') {
      setApiError(
        language === 'id' 
          ? 'Silakan ketik deskripsi topik atau produk Anda terlebih dahulu!' 
          : 'Please describe your topic or product concept first!'
      );
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const apiReqBody = {
        topic,
        platform,
        tone,
        framework,
        length,
        includeHashtags,
        hashtagCount,
        includeEmojis,
        language
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiReqBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server responded with an execution error.');
      }

      const data: GenerationResponse = await res.json();
      setResponse(data);
      
      // Auto-populate the active mockup preview with the first generated option
      if (data.captions && data.captions.length > 0) {
        setActiveCaptionText(data.captions[0].text);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Error occurred while contacting the helper client.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copying text to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle saving to favorites list
  const handleToggleFavorite = (captionText: string, optionId: string) => {
    const isAlreadySaved = savedCaptions.some(sc => sc.text === captionText);
    
    if (isAlreadySaved) {
      const filtered = savedCaptions.filter(sc => sc.text !== captionText);
      setSavedCaptions(filtered);
      saveFavoritesToLocalStorage(filtered);
    } else {
      const newItem: SavedCaption = {
        id: `saved-${Date.now()}`,
        topic: topic || 'Custom Content Draft',
        platform,
        tone,
        text: captionText,
        savedAt: new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      const updated = [newItem, ...savedCaptions];
      setSavedCaptions(updated);
      saveFavoritesToLocalStorage(updated);
      setFavoritedId(optionId);
      setTimeout(() => setFavoritedId(null), 1500);
    }
  };

  // Delete caption from Favorites shelf
  const handleDeleteFavorite = (id: string) => {
    const filtered = savedCaptions.filter(sc => sc.id !== id);
    setSavedCaptions(filtered);
    saveFavoritesToLocalStorage(filtered);
  };

  // Swap components inside active visualizer
  const handleSwapHook = (newHook: string) => {
    // Attempt parsing lines or replace first sentence
    const prLines = activeCaptionText.split('\n');
    if (prLines.length > 0) {
      prLines[0] = newHook;
      setActiveCaptionText(prLines.join('\n'));
    } else {
      setActiveCaptionText(`${newHook}\n${activeCaptionText}`);
    }
  };

  const handleSwapCta = (newCta: string) => {
    // Find last line or append safely
    const prLines = activeCaptionText.split('\n');
    const lastFilledIndex = prLines.reduce((acc, line, idx) => line.trim() !== '' ? idx : acc, -1);
    
    if (lastFilledIndex !== -1) {
      // Check if last non-empty contains hashtags. If so, let's prepend CTA before hashtags
      const hashtagsLines = prLines.filter(line => line.trim().startsWith('#'));
      if (hashtagsLines.length > 0) {
        // Find index of first hashtag line
        const firstHashIdx = prLines.findIndex(line => line.trim().startsWith('#'));
        prLines.splice(firstHashIdx, 0, newCta, '');
        setActiveCaptionText(prLines.join('\n'));
      } else {
        prLines[lastFilledIndex] = newCta;
        setActiveCaptionText(prLines.join('\n'));
      }
    } else {
      setActiveCaptionText(`${activeCaptionText}\n\n${newCta}`);
    }
  };

  const handleAppendHashtag = (tag: string) => {
    if (!activeCaptionText.includes(tag)) {
      setActiveCaptionText(prev => `${prev} ${tag}`);
    }
  };

  // Platform specific visual boundaries configuration
  const platformConfig: Record<Platform, { name: string; maxChar: number; icon: string; themeBg: string; activeColor: string }> = {
    instagram: { name: 'Instagram', maxChar: 2200, icon: '📸', themeBg: 'bg-rose-50 text-rose-600', activeColor: 'border-rose-500' },
    tiktok: { name: 'TikTok', maxChar: 4000, icon: '🎵', themeBg: 'bg-indigo-50 text-indigo-600', activeColor: 'border-indigo-500' },
    twitter: { name: 'Twitter/X', maxChar: 280, icon: '🐦', themeBg: 'bg-slate-50 text-slate-800', activeColor: 'border-slate-800' },
    linkedin: { name: 'LinkedIn', maxChar: 3000, icon: '👔', themeBg: 'bg-blue-50 text-blue-600', activeColor: 'border-blue-500' },
    facebook: { name: 'Facebook', maxChar: 63000, icon: '📘', themeBg: 'bg-sky-50 text-sky-600', activeColor: 'border-sky-500' },
  };

  const toneConfig: Record<Tone, { nameId: string; nameEn: string; icon: string; bg: string; text: string }> = {
    aesthetic: { nameId: 'Estetik / Slow Living', nameEn: 'Aesthetic Chill', icon: '✨', bg: 'bg-violet-100', text: 'text-violet-700' },
    professional: { nameId: 'Bisnis / Edukatif', nameEn: 'Professional Pro', icon: '👔', bg: 'bg-slate-100', text: 'text-slate-700' },
    casual: { nameId: 'Santai / Gaul', nameEn: 'Casual Buzz', icon: '☕', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    inspiring: { nameId: 'Inspiratif / Hangat', nameEn: 'Inspiring Deep', icon: '💖', bg: 'bg-rose-100', text: 'text-rose-700' },
    witty: { nameId: 'Humoris / Cerdas', nameEn: 'Witty / Funny', icon: '🤣', bg: 'bg-amber-100', text: 'text-amber-700' },
    persuasive: { nameId: 'Promosi / Hard-Sell', nameEn: 'Persuasive Sales', icon: '🎯', bg: 'bg-red-100', text: 'text-red-700' },
    bold: { nameId: 'Berani & Hype', nameEn: 'Bold & Loud', icon: '⚡', bg: 'bg-pink-100', text: 'text-pink-700' },
    informative: { nameId: 'Edukatif Mendalam', nameEn: 'Informative News', icon: '📚', bg: 'bg-cyan-100', text: 'text-cyan-700' },
  };

  return (
    <div className="bg-[#FDF2F8] min-h-screen flex flex-col font-sans text-slate-900 overflow-x-hidden antialiased">
      {/* Navigation Bar styled according to Vibrant Palette constraints */}
      <nav className="h-16 bg-white border-b border-pink-100 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-black italic">
            C.
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600 tracking-tight">
              Caption.io
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest -mt-1">
              Social Media Strategy Engine
            </span>
          </div>
        </div>

        {/* Global Control Bar containing credits, languages, options */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Credit Indicators */}
          <div className="hidden sm:flex items-center gap-1.5 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full text-xs font-semibold text-pink-700">
            <Sparkles className="w-3.5 h-3.5 fill-pink-500/30 text-pink-600" />
            <span>AI Credits: Unlimited</span>
          </div>

          {/* Language Selector Selector */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                language === 'id' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Bahasa Indonesia"
            >
              🇮🇩 <span className="hidden xs:inline">Indo</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="English"
            >
              🇬🇧 <span className="hidden xs:inline">Eng</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Area with flex rows */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 max-w-7xl w-full mx-auto">
        
        {/* SIDEBAR CONTAINER: Form Control Panel */}
        <aside className="w-full lg:w-96 bg-white rounded-3xl shadow-xl shadow-pink-100/50 p-5 sm:p-6 flex flex-col gap-5 border border-pink-50/50 self-start">
          
          {/* Header instructions */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              🚀 {language === 'id' ? 'Konfigurasi Konten' : 'Caption Wizard'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'id' 
                ? 'Sesuaikan parameter di bawah untuk menghasilkan copywriting bermutu tinggi.' 
                : 'Configure strategic copy assets designed for high engagement.'}
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Input Box 1: Platform Selection */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 block">
              {language === 'id' ? 'Pilih Platform' : 'Select Target Audience'}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(platformConfig) as Platform[]).map((p) => {
                const isActive = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? `${platformConfig[p].themeBg} ${platformConfig[p].activeColor} shadow-xs scale-102` 
                        : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-100 hover:bg-slate-100/60'
                    }`}
                  >
                    <span className="text-lg ">{platformConfig[p].icon}</span>
                    <span className="text-[8px] font-black mt-1 uppercase select-none tracking-tight">
                      {platformConfig[p].name.slice(0, 5)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box 2: Topic Description with Quick Templates */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label htmlFor="topic-input" className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                {language === 'id' ? 'Deskripsi Topik / Produk' : 'Topic details'}
              </label>
              <span className="text-[10px] text-slate-400 font-bold">
                {topic.length} / 500
              </span>
            </div>
            
            <textarea
              id="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                language === 'id' 
                  ? 'Contoh: Peluncuran kemeja batik modern model slim-fit dengan corak mega mendung, cocok buat hangout anak muda Bandung...'
                  : 'Example: Handcrafted aesthetic ceramic mugs, eco-friendly to elevate early morning coffee workspace routines...'
              }
              maxLength={500}
              className="w-full h-32 bg-slate-50 border border-slate-200/50 rounded-2xl p-4 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-hidden resize-none transition-shadow text-slate-800 placeholder:text-slate-400"
            />

            {/* Template component */}
            <TemplatePrompts onSelect={handleSelectTemplate} language={language} />
          </div>

          {/* Input Box 3: Tone & Vibes selection list */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 block">
              {language === 'id' ? 'Gaya & Nuansa (Tone / Vibe)' : 'Tone / Brand Vibe'}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {(Object.keys(toneConfig) as Tone[]).map((t) => {
                const isActive = tone === t;
                const conf = toneConfig[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-2 text-left rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border-2 ${
                      isActive 
                        ? `${conf.bg} ${conf.text} border-pink-500 shadow-xs` 
                        : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span className="truncate">{language === 'id' ? conf.nameId : conf.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box 4: Collapsible advanced settings accordion for tidy layout */}
          <div className="border border-pink-50 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full bg-slate-50/50 hover:bg-slate-100/50 p-3.5 text-xs font-bold text-slate-600 flex justify-between items-center transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Settings className="w-4 h-4 text-slate-400" />
                {language === 'id' ? 'Formulasi Lanjutan ⚙️' : 'Copy Formula Rules'}
              </span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 bg-white border-t border-gray-100 space-y-4">
                {/* Advanced framework Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="framework-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    {language === 'id' ? 'Formula Copywriting' : 'Sales Framework'}
                  </label>
                  <select
                    id="framework-select"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as CopywritingFramework)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-pink-400"
                  >
                    <option value="hook-body-cta">{language === 'id' ? 'Hook - Body - CTA' : 'Hook-Body-CTA (Recommended)'}</option>
                    <option value="simple">{language === 'id' ? 'Sederhana / To the point' : 'Direct Simple Copy'}</option>
                    <option value="aida">AIDA (Attention, Interest, Desire, Action)</option>
                    <option value="pas">PAS (Problem, Agitate, Solve)</option>
                    <option value="storytelling">{language === 'id' ? 'Eksklusif Cerita (Storytelling)' : 'Interactive Storytelling'}</option>
                  </select>
                </div>

                {/* Length selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    {language === 'id' ? 'Panjang Karakter' : 'Post Length'}
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                    {(['short', 'medium', 'long'] as CaptionLength[]).map((ln) => (
                      <button
                        key={ln}
                        type="button"
                        onClick={() => setLength(ln)}
                        className={`text-[10px] font-bold py-1.5 rounded transition capitalize cursor-pointer ${
                          length === ln ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {ln === 'short' ? (language === 'id' ? 'Penyek' : 'Short') : ln === 'medium' ? (language === 'id' ? 'Sedang' : 'Medium') : (language === 'id' ? 'Panjang' : 'Long')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emoji toggle swapper */}
                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {language === 'id' ? 'Gunakan Emojis' : 'Embed Emojis'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIncludeEmojis(!includeEmojis)}
                    className={`w-10 h-6.5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
                      includeEmojis ? 'bg-pink-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <span className="w-5.5 h-5.5 rounded-full bg-white flex items-center justify-center text-[10px]">
                      {includeEmojis ? '✨' : '❌'}
                    </span>
                  </button>
                </div>

                {/* Hashtag Configurator */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      {language === 'id' ? 'Sertakan Hashtags' : 'Include Hashtags'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIncludeHashtags(!includeHashtags)}
                      className={`w-10 h-6.5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer ${
                        includeHashtags ? 'bg-violet-500 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5.5 h-5.5 rounded-full bg-white flex items-center justify-center text-[10px]">
                        {includeHashtags ? '🏷️' : '❌'}
                      </span>
                    </button>
                  </div>

                  {includeHashtags && (
                    <div className="space-y-1 bg-violet-50/50 p-2 rounded-xl border border-violet-100">
                      <div className="flex justify-between text-[10px] text-violet-700 font-bold">
                        <span>{language === 'id' ? 'Jumlah Tagar:' : 'Total tags:'}</span>
                        <span>{hashtagCount}</span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={15}
                        value={hashtagCount}
                        onChange={(e) => setHashtagCount(parseInt(e.target.value))}
                        className="w-full accent-violet-600 cursor-pointer h-1 bg-violet-200 rounded-lg outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Core submission Action: Generate Magic Styled as Gradient block from instruction layout */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-105 active:brightness-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{language === 'id' ? 'Menghubungkan ke Gemini...' : 'Connecting to Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-white/10" />
                <span>{language === 'id' ? 'Hasilkan Magic ✨' : 'Generate Magic ✨'}</span>
              </>
            )}
          </button>

          {/* Validation Prompt Warnings UI block */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-start gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{language === 'id' ? 'Pemberitahuan' : 'System Notice'}</p>
                <p className="text-[11px] leading-relaxed mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

        </aside>

        {/* MAIN RESULTS DISPLAY AND GRAPHICAL INTERACTION FEED PANEL */}
        <main className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* Top Section layout: Interactive Feed visualization simulator */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Visual Editor Feed Simulator */}
            <div className="md:col-span-7 flex flex-col">
              <PlatformMockup
                platform={platform}
                captionText={activeCaptionText}
                topic={topic || (language === 'id' ? 'Ide Konten Kreatif' : 'Creative Content Idea')}
                username={username}
                onUsernameChange={setUsername}
                characterLimit={platformConfig[platform].maxChar}
              />
            </div>

            {/* Quick Live Draft Editor Toolbar */}
            <div className="md:col-span-5 bg-white border border-pink-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-left relative min-h-[300px]">
              <div className="space-y-3.5">
                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-[10px] font-black uppercase rounded block w-max">
                  Drafting Room
                </span>
                
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Edit2 className="w-4 h-4 text-pink-500" />
                  {language === 'id' ? 'Sesuaikan Draft Live' : 'Live Draft Editor'}
                </h3>
                
                <p className="text-[11px] text-gray-500 leading-normal">
                  {language === 'id' 
                    ? 'Gunakan tab ini untuk mengubah deskripsi secara instan sebelum melakukan penyalinan!' 
                    : 'Changes here directly update the design mockup simulator on the left side.'}
                </p>

                <textarea
                  value={activeCaptionText}
                  onChange={(e) => setActiveCaptionText(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-400 outline-none text-slate-800 font-sans leading-relaxed resize-none"
                  placeholder={language === 'id' ? 'Silakan ketik atau klik salah satu cap di bawah...' : 'Draft appears here...'}
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(activeCaptionText, 'active-clipboard')}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  {copiedId === 'active-clipboard' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Disalin!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Salin Hasil' : 'Copy All'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFavorite(activeCaptionText, 'active-fav')}
                  className="px-3 py-2 border border-pink-200 hover:bg-pink-50 text-pink-600 font-semibold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${savedCaptions.some(sc => sc.text === activeCaptionText) ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span>{language === 'id' ? 'Mug Favorit' : 'Save Fav'}</span>
                </button>
              </div>
            </div>

          </section>

          {/* Results Block: Loaded choices styled inside beautiful cards with Vibrant Palette borders */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-left">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  🪄 {language === 'id' ? 'Rekomendasi Konten Gemini' : 'AI Strategic Options'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'id' 
                    ? 'Silakan klik "Terapkan Ke Preview" untuk menerapkan teks di simulator di atas!'
                    : 'Click any option card to instantly apply the copy to your active mockup preview.'}
                </p>
              </div>
              
              {response?.captions && (
                <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {language === 'id' ? '3 Pilihan Siap Pakai' : '3 High Converting Options'}
                </span>
              )}
            </div>

            {/* Generated Cards Container with color guidelines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {response ? (
                response.captions.map((cap, i) => {
                  // Style configurations to match original spec cards
                  const borderColors = ['border-pink-100 hover:border-pink-300', 'border-violet-100 hover:border-violet-300', 'border-amber-100 hover:border-amber-300'];
                  const bgColors = ['bg-pink-50/20', 'bg-violet-50/20', 'bg-amber-50/20'];
                  const labelTexts = [
                    language === 'id' ? 'Opsi 1 • Menggugah Rasa / Punchy' : 'Option 1 • Highly Punchy',
                    language === 'id' ? 'Opsi 2 • Mengundang Aksi / Poetic' : 'Option 2 • Poetic Narrative',
                    language === 'id' ? 'Opsi 3 • Strategi Jualan / Action' : 'Option 3 • Informative & Short'
                  ];
                  const rawBadge = ['bg-pink-100 text-pink-600', 'bg-violet-100 text-violet-600', 'bg-amber-100 text-amber-600'];

                  return (
                    <div
                      key={cap.id}
                      className={`bg-white p-5 rounded-3xl border-2 ${borderColors[i]} relative group transition-all duration-300 shadow-xs flex flex-col justify-between text-left`}
                    >
                      {/* Interactive Buttons Overlay on the top right */}
                      <div className="absolute top-5 right-5 flex gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopy(cap.text, cap.id)}
                          className="p-1.5 bg-white border border-gray-100 hover:bg-pink-50 rounded-lg text-slate-400 hover:text-pink-500 shadow-xs transition"
                          title="Salin teks ini"
                        >
                          {copiedId === cap.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(cap.text, cap.id)}
                          className="p-1.5 bg-white border border-gray-100 hover:bg-pink-50 rounded-lg text-slate-400 hover:text-pink-500 shadow-xs transition"
                          title="Simpan ke favorit"
                        >
                          <Heart className={`w-4 h-4 ${savedCaptions.some(sc => sc.text === cap.text) ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <span className={`px-2 py-1 ${rawBadge[i]} text-[10px] font-black uppercase rounded inline-block`}>
                          {labelTexts[i]}
                        </span>
                        
                        {/* Display Structured framework details and complete caption body text */}
                        <div className="text-slate-700 leading-relaxed text-xs sm:text-sm font-sans pr-8 whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {cap.text}
                        </div>
                      </div>

                      {/* Apply button to load text to active simulator */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveCaptionText(cap.text)}
                          className="text-[11px] font-extrabold text-pink-600 hover:text-pink-700 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {language === 'id' ? 'Terapkan Ke Preview' : 'Preview Mockup'}
                        </button>

                        <span className="text-[10px] text-gray-400 font-mono">
                          {cap.text.length} chars
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Clean informative placeholder cards shown before first click
                <>
                  <div className="bg-white p-6 rounded-3xl border-2 border-pink-100/60 flex flex-col justify-between text-left min-h-36">
                    <div className="space-y-3">
                      <span className="px-2 py-1 bg-pink-100 text-pink-600 text-[10px] font-black uppercase rounded inline-block">
                        Option 1 • Hook Focus
                      </span>
                      <p className="text-xs text-slate-400 italic">
                        {language === 'id' 
                          ? 'Draf konten pertama dengan formula pembuka (hook) yang tajam akan dihasilkan di sini setelah Anda menekan tombol "Hasilkan Magic".'
                          : 'Your high impact first option generated focusing on immediate pattern-interruption rules will appear here.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-violet-100/60 flex flex-col justify-between text-left min-h-36">
                    <div className="space-y-3">
                      <span className="px-2 py-1 bg-violet-100 text-violet-600 text-[10px] font-black uppercase rounded inline-block">
                        Option 2 • Story Value
                      </span>
                      <p className="text-xs text-slate-400 italic">
                        {language === 'id'
                          ? 'Draf konten kedua dengan nuansa storytelling mendalam, dikonfigurasi untuk memicu minat emosional pembaca.'
                          : 'Your second option optimized with highly persuasive storytelling flow guidelines.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-amber-100/60 flex flex-col justify-between text-left min-h-36 opacity-70">
                    <div className="space-y-3">
                      <span className="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase rounded inline-block">
                        Option 3 • Clear Action
                      </span>
                      <p className="text-xs text-slate-400 italic">
                        {language === 'id'
                          ? 'Draf konten ketiga dengan format terstruktur pendek dan instruksi promosi (Call to Action/CTA) yang sangat spesifik.'
                          : 'Your third option centering direct benefits and crisp actionable call-to-actions.'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Mix Match Lab (Swaps hooks/CTAs alternative options from response attributes) */}
          {response && (
            <MixMatchSection
              alternativeHooks={response.alternativeHooks}
              alternativeCtas={response.alternativeCtas}
              hashtags={response.hashtags}
              onSwapHook={handleSwapHook}
              onSwapCta={handleSwapCta}
              onAppendHashtag={handleAppendHashtag}
              language={language}
            />
          )}

          {/* RECENTS FAVORITES COLLECTION: Drawer persistent shelf styled exactly like footer template */}
          <section className="bg-white rounded-3xl p-5 border border-pink-100/70 shadow-xs text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-violet-500 rounded-full animate-ping"></span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-violet-500" />
                  {language === 'id' ? 'Koleksi Simpanan (Saved Shelf)' : 'Recent Creations Library'}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {language === 'id' ? `Menyimpan ${savedCaptions.length} draft` : `${savedCaptions.length} creations collected`}
              </span>
            </div>

            {savedCaptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedCaptions.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 bg-pink-50/20 rounded-2xl border border-pink-100/50 flex flex-col justify-between relative group hover:shadow-xs transition duration-200 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 bg-white text-slate-500 font-bold rounded capitalize border border-gray-100 tracking-tight text-[9px]">
                          {platformConfig[item.platform]?.icon} {item.platform}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono font-medium">{item.savedAt}</span>
                      </div>
                      
                      {/* Topic title excerpt */}
                      <p className="text-[10px] text-gray-400 truncate leading-relaxed">
                        <strong>Topic:</strong> {item.topic}
                      </p>
                      
                      {/* Saved caption text body scrollable */}
                      <p className="text-slate-700 font-normal leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto pr-1">
                        {item.text}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveCaptionText(item.text)}
                        className="text-[10px] font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        {language === 'id' ? 'Load simulator' : 'Load visual'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.text, item.id)}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-pink-600 transition"
                          title="Copy caption"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFavorite(item.id)}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500 transition"
                          title="Delete from list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">
                  {language === 'id' ? 'Belum ada konten tersimpan.' : 'Favorites collection is currently empty.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'id' 
                    ? 'Klik ikon hati ❤️ pada opsi untuk menyimpan copywriting terbaik Anda ke rak ini!' 
                    : 'Click saving actions on any card to store top drafts securely here.'}
                </p>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
