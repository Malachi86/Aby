import React from 'react';
import { useBlog } from '../context/BlogContext';
import { ArticlePost } from '../types';
import { Bookmark, Clock, Trash2, X, ArrowRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: ArticlePost) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const { bookmarks, articles, toggleBookmark } = useBlog();

  if (!isOpen) return null;

  const bookmarkedArticles = articles.filter(a => bookmarks.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0C0420] border border-[#BA6E8F]/40 shadow-2xl text-stone-100 flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#BA6E8F]/30 bg-[#1b0a24]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[#F8A5C2] fill-[#F8A5C2]" />
            <h2 className="font-serif text-lg font-bold text-white tracking-tight">
              My Reading List ({bookmarkedArticles.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {bookmarkedArticles.length > 0 ? (
            bookmarkedArticles.map((art) => (
              <div
                key={art.id}
                className="group p-4 rounded-2xl border border-[#BA6E8F]/30 bg-[#1b0a24]/50 hover:border-[#F8A5C2] hover:bg-[#2d1338]/60 transition-all flex items-center justify-between gap-3 shadow-sm"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectArticle(art);
                  }}
                  className="cursor-pointer flex-1"
                >
                  <span className="text-[10px] font-bold text-[#F8A5C2] uppercase tracking-wider block mb-1">
                    {art.categoryName}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#F8A5C2] transition-colors line-clamp-1 mb-1">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-sans">
                    <Clock className="w-3 h-3 text-[#F8A5C2]" />
                    <span>{art.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.publishedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="p-2 text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                    title="Remove from reading list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectArticle(art);
                    }}
                    className="p-2 text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl font-bold transition-all shadow-xs"
                    title="Read article"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-14 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1b0a24] border border-[#BA6E8F]/30 flex items-center justify-center text-[#F8A5C2]">
                <Bookmark className="w-6 h-6 text-[#F8A5C2]" />
              </div>
              <p className="text-sm font-bold text-white mb-1">
                Your reading list is empty
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any editorial or essay to save it here for leisurely reading anytime.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
