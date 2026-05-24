import React from 'react';
import { Sparkles, ShoppingBag, Eye, HelpCircle, GraduationCap, Heart } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  topic: string;
  icon: React.ReactNode;
  category: string;
}

interface TemplatePromptsProps {
  onSelect: (topic: string) => void;
  language: 'id' | 'en';
}

export default function TemplatePrompts({ onSelect, language }: TemplatePromptsProps) {
  const templates: Template[] = [
    {
      id: "product_launch",
      name: language === 'id' ? "Peluncuran Produk" : "Product Launch",
      topic: language === 'id' 
        ? "Peluncuran mug keramik buatan tangan bercorak estetik, tahan panas, dan ramah lingkungan untuk menemani kopi pagi."
        : "Launching a handmade aesthetic ceramic mug, heat-resistant, and eco-friendly to elevate morning coffee sessions.",
      icon: <ShoppingBag className="w-4 h-4 text-violet-500" />,
      category: "Sales"
    },
    {
      id: "behind_scenes",
      name: language === 'id' ? "Dibalik Layar" : "Behind the Scenes",
      topic: language === 'id'
        ? "Melihat proses kreatif dari studio kerajinan kami, dari pembentukan tanah liat mentah hingga menjadi karya seni dekorasi rumah."
        : "Checking out the creative process from our pottery studio, charting the journey from raw clay to beautiful home decor masterpieces.",
      icon: <Eye className="w-4 h-4 text-indigo-500" />,
      category: "Engagement"
    },
    {
      id: "interactive_q",
      name: language === 'id' ? "Pertanyaan Interaktif" : "Interactive Question",
      topic: language === 'id'
        ? "Mengajak audiens berdiskusi tentang kebiasaan produktif pagi mereka: kopi dulu atau langsung olahraga?"
        : "Inviting the audience to share their morning routines: Coffee first or immediate morning exercise?",
      icon: <HelpCircle className="w-4 h-4 text-pink-500" />,
      category: "Growth"
    },
    {
      id: "educational_tips",
      name: language === 'id' ? "Tips Bermanfaat" : "Educational Tips",
      topic: language === 'id'
        ? "3 tips praktis merawat barang dekorasi kayu lokal agar awet puluhan tahun tanpa memudar."
        : "3 practical tips to care for local wooden home decor so they last for decades without fading.",
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
      category: "Education"
    },
    {
      id: "motivational",
      name: language === 'id' ? "Kutipan Motivasi" : "Inspiring Quote",
      topic: language === 'id'
        ? "Pesan inspiratif untuk hari Senin tentang memulai langkah kecil demi impian besar, cocok untuk UMKM lokal."
        : "An inspiring Monday reminder about starting with small, consistent steps towards massive career dreams.",
      icon: <Heart className="w-4 h-4 text-red-500" />,
      category: "Inspirational"
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
        {language === 'id' ? "Gunakan Template Cepat" : "Quick Start Templates"}
      </label>
      <div className="flex flex-wrap gap-2">
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelect(tmpl.topic)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-700 border border-gray-100 hover:border-violet-200 rounded-full transition-all duration-200 cursor-pointer"
          >
            {tmpl.icon}
            <span>{tmpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
