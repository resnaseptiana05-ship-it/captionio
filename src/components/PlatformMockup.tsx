import React, { useState, useEffect } from 'react';
import { Platform } from '../types';
import { 
  Heart, MessageCircle, Share2, Send, Bookmark, MoreHorizontal, 
  ThumbsUp, MessageSquare, Globe, User, Check, ShieldCheck 
} from 'lucide-react';

interface PlatformMockupProps {
  platform: Platform;
  captionText: string;
  topic: string;
  username: string;
  onUsernameChange: (val: string) => void;
  characterLimit: number;
}

export default function PlatformMockup({
  platform,
  captionText,
  topic,
  username,
  onUsernameChange,
  characterLimit
}: PlatformMockupProps) {
  // Truncation state for platforms with "See More" buttons
  const [isTruncated, setIsTruncated] = useState(true);
  const [gradientSeed, setGradientSeed] = useState(1);

  useEffect(() => {
    // Change gradient on new topic to keep UI interactive and fresh
    setGradientSeed(prev => prev + 1);
    setIsTruncated(true);
  }, [topic]);

  const charCount = captionText.length;
  const isOverLimit = charCount > characterLimit;

  // Render a lovely background gradient for simulated posts
  const getGradientClass = () => {
    const gradients = [
      'from-fuchsia-500 to-indigo-600',
      'from-amber-400 to-pink-600',
      'from-emerald-400 to-teal-700',
      'from-violet-600 to-cyan-500',
      'from-rose-500 to-orange-400',
    ];
    return gradients[gradientSeed % gradients.length];
  };

  // Avatar colors
  const avatarColors: Record<Platform, string> = {
    instagram: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600',
    tiktok: 'bg-gradient-to-br from-cyan-400 via-dark-900 to-pink-500',
    twitter: 'bg-slate-900',
    linkedin: 'bg-blue-600',
    facebook: 'bg-indigo-600',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Mockup Header Controls */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span className="text-xs font-semibold text-gray-500 ml-1 select-none uppercase tracking-wider">
            Live Feed Feedbox Preview
          </span>
        </div>
        
        {/* Username Customizer inside Preview Toolbar */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
          <label htmlFor="user-handle-input" className="text-[10px] font-bold text-gray-400 uppercase">Handle:</label>
          <input
            id="user-handle-input"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="username"
            className="text-xs font-semibold text-gray-700 bg-transparent border-none outline-none focus:ring-0 p-0 w-24 text-right"
          />
        </div>
      </div>

      {/* Actual Feed Content Scrollable Grid */}
      <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center bg-gray-50 overflow-y-auto min-h-[400px]">
        {/* INSTAGRAM PREVIEW */}
        {platform === 'instagram' && (
          <div className="w-full max-w-[380px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm text-left">
            {/* User credentials banner */}
            <div className="p-3 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full p-[1.5px] ${avatarColors.instagram}`}>
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {username.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
                    {username}
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium">Sponsored &bull; Jakarta</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            {/* Simulated Post Image Grid */}
            <div className={`w-full aspect-square bg-gradient-to-tr ${getGradientClass()} relative flex flex-col items-center justify-center text-center p-6 text-white`}>
              <div className="absolute top-2.5 right-2.5 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase">
                1 / 1
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-6 rounded-2xl max-w-[85%] shadow-md select-none transform transition hover:scale-102">
                <p className="font-sans font-bold text-sm tracking-tight leading-tight uppercase drop-shadow">
                  {topic.length > 80 ? topic.slice(0, 80) + '...' : topic}
                </p>
                <div className="mt-4 w-6 h-1 bg-white mx-auto rounded"></div>
              </div>
            </div>

            {/* Social Actions Panel */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
                  <MessageCircle className="w-5 h-5 cursor-pointer hover:scale-105 transition-transform" />
                  <Send className="w-5 h-5 cursor-pointer hover:rotate-12 transition-transform" />
                </div>
                <Bookmark className="w-5 h-5 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" />
              </div>
              
              {/* Like Metas */}
              <p className="text-xs font-bold text-gray-900 mb-1">1,245 likes</p>

              {/* Caption area */}
              <div className="text-xs text-gray-800 leading-relaxed font-sans mt-1">
                <span className="font-bold text-gray-950 mr-2.5">{username}</span>
                {isTruncated && captionText.length > 120 ? (
                  <>
                    <span>{captionText.slice(0, 120)}...</span>
                    <button 
                      onClick={() => setIsTruncated(false)}
                      className="text-gray-400 font-semibold ml-1.5 focus:outline-none hover:text-gray-600 block sm:inline mt-1 sm:mt-0"
                    >
                      more
                    </button>
                  </>
                ) : (
                  <span className="whitespace-pre-wrap">{captionText}</span>
                )}
              </div>

              {/* Timestamp */}
              <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mt-3">3 minutes ago</p>
            </div>
          </div>
        )}

        {/* TIKTOK PREVIEW */}
        {platform === 'tiktok' && (
          <div className="w-full max-w-[340px] aspect-[9/16] bg-slate-950 text-white rounded-2xl overflow-hidden shadow-lg relative text-left select-none">
            {/* Background Mesh representing Video play */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getGradientClass()} opacity-60 flex items-center justify-center`}>
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white/80 animate-spin"></div>
            </div>

            {/* Bottom Overlay containing Caption */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pb-6 z-10 font-sans">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="font-bold text-sm text-white">@{username}</span>
                <span className="bg-[#fe2c55] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Plus</span>
              </div>

              {/* TikTok Scrolling Captions content */}
              <div className="text-xs text-gray-200 leading-relaxed max-h-[140px] overflow-y-auto mb-3 scrollbar-none pr-2">
                <p className="whitespace-pre-wrap">{captionText}</p>
              </div>

              {/* Audio tag */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-mono">
                <span className="animate-pulse">♫</span>
                <span>Original Sound - @{username} ({new Date().getFullYear()})</span>
              </div>
            </div>

            {/* Right Side Video engagement action panel */}
            <div className="absolute right-3.5 bottom-20 z-10 flex flex-col items-center gap-4 text-white">
              {/* Avatar circle */}
              <div className="w-10 h-10 rounded-full border-2 border-white relative flex items-center justify-center bg-slate-800 text-xs font-bold shadow-md">
                {username.slice(0, 2).toUpperCase()}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#fe2c55] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  +
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                  <Heart className="w-5 h-5 fill-[#fe2c55] text-[#fe2c55]" />
                </div>
                <span className="text-[10px] font-bold mt-1">45.2K</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1">112</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1">6,981</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="p-2.5 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1">Share</span>
              </div>
            </div>

            {/* Top Bar Tabs */}
            <div className="absolute top-4 inset-x-0 z-10 flex justify-center gap-4 text-xs font-semibold text-white/60">
              <span className="cursor-pointer">Following</span>
              <span className="text-white border-b-2 border-white pb-1 font-bold">For You</span>
            </div>
          </div>
        )}

        {/* TWITTER/X PREVIEW */}
        {platform === 'twitter' && (
          <div className="w-full max-w-[390px] bg-slate-950 text-white rounded-xl border border-slate-800 p-4 shadow-md text-left font-sans">
            {/* User Profile bar */}
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-xs font-bold flex items-center justify-center text-white border border-slate-700">
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-white truncate hover:underline cursor-pointer">{username}</span>
                      <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400" />
                      <span className="text-xs text-slate-500 truncate">@{username} &bull; Now</span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>

                {/* Tweet Body containing live caption */}
                <div className="text-sm text-slate-100 mt-2 whitespace-pre-wrap leading-relaxed">
                  {captionText}
                </div>

                {/* Simulated URL Card Preview if long and contains key terms */}
                <div className="mt-3.5 border border-slate-800 rounded-xl overflow-hidden hover:bg-slate-900 cursor-pointer transition">
                  <div className={`h-24 bg-gradient-to-r ${getGradientClass()} relative`}></div>
                  <div className="p-2.5 text-xs text-left">
                    <p className="text-slate-500 font-mono tracking-wider lowercase">link.co/media</p>
                    <p className="font-semibold text-slate-200 mt-0.5 truncate">{topic}</p>
                    <p className="text-slate-400 truncate mt-0.5">Explore more of our modern campaign launches.</p>
                  </div>
                </div>

                {/* Tweet Stats line */}
                <div className="flex items-center justify-between text-slate-500 text-xs mt-4 pb-1 border-b border-slate-800/60">
                  <span>9:41 AM &bull; May 24, 2026 &bull; <strong className="text-white">5,102</strong> Views</span>
                </div>

                {/* Action feedback bar */}
                <div className="flex justify-between items-center text-slate-500 max-w-[90%] mx-auto mt-3">
                  <MessageSquare className="w-4 h-4 hover:text-blue-400 transition" />
                  <Share2 className="w-4 h-4 hover:text-green-400 transition" />
                  <Heart className="w-4 h-4 hover:text-pink-500 transition" />
                  <Bookmark className="w-4 h-4 hover:text-blue-400 transition" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN PREVIEW */}
        {platform === 'linkedin' && (
          <div className="w-full max-w-[420px] bg-white rounded-xl border border-gray-200 shadow-sm text-left font-sans">
            {/* LinkedIn Card Header */}
            <div className="p-4 flex items-start gap-2.5 border-b border-gray-50">
              <div className="w-10 h-10 rounded-sm bg-blue-100 text-xs font-bold flex items-center justify-center text-blue-800">
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-gray-900 hover:underline cursor-pointer">{username}</span>
                  <span className="text-[10px] text-gray-400 font-bold">&bull; 1st</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">Founder & CEO, Creative Content Ventures</p>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-medium">
                  <span>Now</span>
                  <span>&bull;</span>
                  <Globe className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              <button className="text-blue-600 hover:bg-blue-50 text-[11px] font-bold px-2 py-1 rounded transition flex items-center gap-1">
                + Follow
              </button>
            </div>

            {/* Post text */}
            <div className="px-4 py-3 text-xs text-gray-800 leading-relaxed font-normal">
              {isTruncated && captionText.length > 200 ? (
                <>
                  <span className="whitespace-pre-wrap">{captionText.slice(0, 200)}...</span>
                  <button 
                    onClick={() => setIsTruncated(false)}
                    className="text-blue-600 font-bold ml-1 hover:underline focus:outline-none"
                  >
                    ...see more
                  </button>
                </>
              ) : (
                <span className="whitespace-pre-wrap">{captionText}</span>
              )}
            </div>

            {/* LinkedIn Rich Document Attachment */}
            <div className="border hover:border-gray-300 transition-colors mx-4 mb-3 rounded overflow-hidden cursor-pointer">
              <div className={`h-24 bg-gradient-to-r ${getGradientClass()} flex items-center justify-center p-4 text-white text-center`}>
                <span className="text-[11px] font-bold uppercase tracking-wide border-2 border-white px-3 py-1 bg-white/10 backdrop-blur-sm rounded">
                  {topic.length > 50 ? topic.slice(0, 50) + '...' : topic}
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 text-[10px] text-slate-600 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 text-xs truncate">{topic}</p>
                  <p className="text-gray-500 truncate mt-0.5">14 slides &bull; Creative Guidebook</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold p-1 rounded">PDF</span>
              </div>
            </div>

            {/* Post stats counter */}
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <span className="bg-blue-500 p-0.5 rounded-full text-white text-[7px] w-3.5 h-3.5 flex items-center justify-center font-bold">👍</span>
                <span className="bg-red-500 p-0.5 rounded-full text-white text-[7px] w-3.5 h-3.5 flex items-center justify-center font-bold">❤️</span>
                <span className="font-medium text-gray-500 hover:text-blue-600 cursor-pointer ml-1">Anita and 348 others</span>
              </div>
              <span>12 comments &bull; 8 reposts</span>
            </div>

            {/* Interactive like comments footer bar */}
            <div className="px-2 py-1 flex justify-between text-gray-500 text-xs">
              <button className="flex items-center gap-1.5 hover:bg-gray-100 flex-1 justify-center py-2 rounded transition cursor-pointer">
                <ThumbsUp className="w-4 h-4" /> <span className="text-[11px] font-bold">Like</span>
              </button>
              <button className="flex items-center gap-1.5 hover:bg-gray-100 flex-1 justify-center py-2 rounded transition cursor-pointer">
                <MessageSquare className="w-4 h-4" /> <span className="text-[11px] font-bold">Comment</span>
              </button>
              <button className="flex items-center gap-1.5 hover:bg-gray-100 flex-1 justify-center py-2 rounded transition cursor-pointer">
                <Share2 className="w-4 h-4" /> <span className="text-[11px] font-bold">Share</span>
              </button>
            </div>
          </div>
        )}

        {/* FACEBOOK PREVIEW */}
        {platform === 'facebook' && (
          <div className="w-full max-w-[420px] bg-white rounded-lg border border-gray-200 shadow-sm text-left font-sans">
            {/* Facebook Card Header */}
            <div className="p-3 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-xs font-bold flex items-center justify-center text-indigo-800">
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-gray-900 hover:underline cursor-pointer">{username}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                  <span>3 hrs ago</span>
                  <span>&bull;</span>
                  <Globe className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>

            {/* Facebook Post body */}
            <div className="px-3 pb-3 text-xs text-gray-800 leading-relaxed font-sans mt-0.5">
              {isTruncated && captionText.length > 220 ? (
                <>
                  <span className="whitespace-pre-wrap">{captionText.slice(0, 220)}...</span>
                  <button 
                    onClick={() => setIsTruncated(false)}
                    className="text-gray-500 font-bold ml-1.5 hover:underline focus:outline-none block"
                  >
                    See more
                  </button>
                </>
              ) : (
                <span className="whitespace-pre-wrap">{captionText}</span>
              )}
            </div>

            {/* Large simulated post media block */}
            <div className={`w-full h-44 bg-gradient-to-tr ${getGradientClass()} relative flex items-center justify-center text-center p-4 text-white`}>
              <div className="backdrop-blur-sm bg-black/20 p-4 border border-white/20 rounded">
                <p className="font-bold tracking-tight text-xs uppercase text-gray-50 uppercase shadow-sm">
                  {topic.length > 60 ? topic.slice(0, 60) + '...' : topic}
                </p>
                <p className="text-[9px] text-slate-300 mt-1 uppercase font-semibold">Special Digital Feature</p>
              </div>
            </div>

            {/* Engagement statistics line */}
            <div className="px-3 py-2 flex items-center justify-between text-gray-400 text-[11px] border-b border-gray-100 mx-1">
              <div className="flex items-center gap-1">
                <span className="bg-blue-500 w-4 h-4 rounded-full text-white text-[8px] flex items-center justify-center">👍</span>
                <span>Likes: 412</span>
              </div>
              <span>18 Comments &bull; 9 Shares</span>
            </div>

            {/* Interactive Actions line */}
            <div className="p-1 flex text-gray-500 text-xs">
              <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 flex-1 justify-center rounded transition cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> <span className="text-[11px] font-bold">Like</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 flex-1 justify-center rounded transition cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" /> <span className="text-[11px] font-bold">Comment</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 flex-1 justify-center rounded transition cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> <span className="text-[11px] font-bold">Share</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Characters warning indicator and quick copiers */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Characters:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded ${isOverLimit ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-200/60 text-gray-700'}`}>
            {charCount} / {characterLimit}
          </span>
          {isOverLimit && (
            <span className="text-red-500 text-[10px] font-bold">
              (Limits exceeded for original platform rules!)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
