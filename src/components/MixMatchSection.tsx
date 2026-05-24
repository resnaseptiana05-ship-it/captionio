import React from 'react';
import { Sparkles, MessageSquare, Flame, Check, HelpCircle, ArrowRight } from 'lucide-react';

interface MixMatchSectionProps {
  alternativeHooks: string[];
  alternativeCtas: string[];
  hashtags: string[];
  onSwapHook: (newHook: string) => void;
  onSwapCta: (newCta: string) => void;
  onAppendHashtag: (tag: string) => void;
  language: 'id' | 'en';
}

export default function MixMatchSection({
  alternativeHooks,
  alternativeCtas,
  hashtags,
  onSwapHook,
  onSwapCta,
  onAppendHashtag,
  language
}: MixMatchSectionProps) {
  const hasHooks = alternativeHooks && alternativeHooks.length > 0;
  const hasCtas = alternativeCtas && alternativeCtas.length > 0;
  const hasHashtags = hashtags && hashtags.length > 0;

  if (!hasHooks && !hasCtas && !hasHashtags) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-6 text-left">
      <div>
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-violet-500" />
          {language === 'id' ? "Mix & Match Laboratorium" : "Mix & Match Lab"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'id' 
            ? "Tekan salah satu tombol di bawah untuk menukar atau memperbarui baris pembuka (hook) atau penutup (CTA) draf Anda secara instan."
            : "Click any block below to swap hooks or CTAs instantly into your current draft."}
        </p>
      </div>

      {hasHooks && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            {language === 'id' ? "Ganti Baris Pembuka (Alternative Hooks)" : "Swap Opening Hook Ideas"}
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {alternativeHooks.map((hook, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSwapHook(hook)}
                className="group w-full text-left p-3 text-xs bg-orange-50/40 hover:bg-orange-50 border border-orange-100/60 hover:border-orange-200 rounded-xl transition duration-200 cursor-pointer flex items-start gap-2.5"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-700 group-hover:text-gray-950 font-medium leading-normal">
                    {hook}
                  </p>
                  <p className="text-[9px] text-orange-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                    {language === 'id' ? "Terapkan Sebagai Pembuka" : "Apply as hook"} <ArrowRight className="w-2.5 h-2.5 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasCtas && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            {language === 'id' ? "Ganti Penutup (Alternative Call-to-Actions)" : "Swap Final call-to-actions"}
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {alternativeCtas.map((cta, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSwapCta(cta)}
                className="group w-full text-left p-3 text-xs bg-blue-50/40 hover:bg-blue-50 border border-blue-100/60 hover:border-blue-200 rounded-xl transition duration-200 cursor-pointer flex items-start gap-2.5"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-700 group-hover:text-gray-950 font-medium leading-normal">
                    {cta}
                  </p>
                  <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                    {language === 'id' ? "Terapkan Sebagai Penutup" : "Apply as CTA"} <ArrowRight className="w-2.5 h-2.5 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasHashtags && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {language === 'id' ? "Rekomendasi Tagar Tambahan (Hashtags)" : "Recommended Hashtag Library"}
          </h4>
          <p className="text-[10px] text-gray-400">
            {language === 'id' ? "Tekan untuk menambahkan tagar secara instan ke draf caption Anda:" : "Click to instantly append hashtags to your active draft:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, idx) => {
              const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onAppendHashtag(formattedTag)}
                  className="px-2.5 py-1 text-xs font-medium font-mono text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 rounded-lg hover:shadow-xs transition cursor-pointer"
                >
                  {formattedTag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
