import React from 'react';
import { useBlog } from '../context/BlogContext';
import { 
  BookOpen, 
  Edit3, 
  Heart, 
  MapPin, 
  Quote, 
  Share2, 
  Sparkles, 
  CheckCircle2,
  Mail 
} from 'lucide-react';

interface AuthorHeroProps {
  onEditProfile?: () => void;
  onExplorePosts?: () => void;
}

export const AuthorHero: React.FC<AuthorHeroProps> = ({ onEditProfile, onExplorePosts }) => {
  const { author, articles, isAdmin } = useBlog();

  // Aggregate stats
  const totalArticles = articles.filter(a => a.status === 'published').length;
  const totalLikes = articles.reduce((acc, curr) => acc + curr.likes, 0);
  const totalViews = articles.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <section id="author-section" className="relative w-full border-b border-[#BA6E8F]/20 overflow-hidden bg-gradient-to-b from-[#180726] via-[#240e32] to-[#0C0420] text-stone-100 py-12 lg:py-16">
      {/* Background ambient pink glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f8b4cb]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#BA6E8F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Author Portrait Column */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative group">
              {/* Outer decorative ring in vibrant rose and soft pink */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#f8b4cb] via-[#BA6E8F] to-[#D391B0] opacity-90 blur-xs group-hover:opacity-100 transition duration-500 shadow-lg shadow-[#BA6E8F]/25" />
              
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#f8b4cb]/40 shadow-2xl bg-[#0C0420]">
                <img
                  src={author.avatar}
                  alt={author.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/author_ruby_aby_portrait_1792571832285.jpg';
                  }}
                />
              </div>

              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 bg-[#0C0420] border-2 border-[#f8b4cb] text-[#f8b4cb] p-1.5 rounded-full shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#f8b4cb]" />
              </div>
            </div>

            {/* Quick stats strip with pink figures */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#BA6E8F]/30 w-full max-w-xs text-center">
              <div>
                <span className="block font-mono text-xl font-bold text-white tabular-nums">
                  {totalArticles}
                </span>
                <span className="text-[11px] text-[#f8b4cb] uppercase tracking-wider font-sans font-semibold">
                  Articles
                </span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-[#f8b4cb] tabular-nums">
                  {totalLikes}
                </span>
                <span className="text-[11px] text-[#f8b4cb] uppercase tracking-wider font-sans font-semibold">
                  Hearts
                </span>
              </div>
              <div>
                <span className="block font-mono text-xl font-bold text-[#D391B0] tabular-nums">
                  {totalViews.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#f8b4cb] uppercase tracking-wider font-sans font-semibold">
                  Reads
                </span>
              </div>
            </div>
          </div>

          {/* Author Details & Bio Column */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {/* Header kicker */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#f8b4cb] mb-3 font-sans">
              <span className="font-bold uppercase tracking-widest text-[#f8b4cb] bg-[#BA6E8F]/20 px-2.5 py-0.5 rounded-full border border-[#f8b4cb]/30">
                {author.columnName}
              </span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-[#f8b4cb]" />
                {author.location}
              </span>
              {isAdmin && onEditProfile && (
                <>
                  <span aria-hidden="true" className="text-stone-500">·</span>
                  <button
                    onClick={onEditProfile}
                    className="flex items-center gap-1 text-xs text-[#f8b4cb] hover:text-white transition-colors underline decoration-dotted font-medium"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Author Profile</span>
                  </button>
                </>
              )}
            </div>

            {/* Author Title & Name */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2 text-wrap-balance">
              {author.name}
            </h1>
            <p className="text-sm sm:text-base text-[#f8b4cb] font-sans font-medium mb-6">
              {author.title}
            </p>

            {/* Bio Prose */}
            <div className="max-w-3xl text-sm sm:text-base text-stone-300 font-body leading-relaxed mb-6">
              <p>{author.bio}</p>
            </div>

            {/* Editorial Quote Box */}
            <div className="relative pl-6 py-3.5 border-l-4 border-[#f8b4cb] bg-[#BA6E8F]/15 rounded-r-2xl max-w-2xl mb-6">
              <Quote className="absolute -top-2 left-2 w-4 h-4 text-[#f8b4cb]/70" />
              <p className="font-serif italic text-sm text-[#f8b4cb] leading-relaxed">
                "{author.motto}"
              </p>
            </div>

            {/* Actions & Socials */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {onExplorePosts && (
                <button
                  onClick={onExplorePosts}
                  className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#f8b4cb] via-[#BA6E8F] to-[#f8b4cb] hover:opacity-90 rounded-xl shadow-lg shadow-[#BA6E8F]/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Editorials</span>
                </button>
              )}

              {/* Contact/Email button */}
              <a
                href={`mailto:${author.email}`}
                className="px-5 py-2.5 text-xs font-semibold text-stone-200 bg-[#5D3C64]/40 hover:bg-[#5D3C64]/70 border border-[#BA6E8F]/40 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#f8b4cb]" />
                <span>Write to Author</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
