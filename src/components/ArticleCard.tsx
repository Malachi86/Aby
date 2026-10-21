import React from 'react';
import { ArticlePost } from '../types';
import { useBlog } from '../context/BlogContext';
import { Bookmark, Clock, Edit, Eye, Heart, MessageSquare, Trash2 } from 'lucide-react';

interface ArticleCardProps {
  article: ArticlePost;
  onSelectArticle: (article: ArticlePost) => void;
  onEditArticle?: (article: ArticlePost) => void;
  onDeleteArticle?: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  onEditArticle,
  onDeleteArticle,
}) => {
  const { likeArticle, likedPosts, toggleBookmark, bookmarks, isAdmin } = useBlog();
  const isLiked = likedPosts.includes(article.id);
  const isBookmarked = bookmarks.includes(article.id);

  return (
    <article className="group flex flex-col justify-between rounded-2xl overflow-hidden border border-[#BA6E8F]/25 bg-[#200d27]/40 hover:bg-[#200d27]/70 hover:border-[#f8b4cb]/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#BA6E8F]/15">
      <div>
        {/* Cover visual (4:3 aspect ratio) */}
        <div 
          onClick={() => onSelectArticle(article)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-[#0C0420] cursor-pointer"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/editorial_pen_notebook_1792570804853.jpg';
            }}
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0420]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Kicker badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-950 bg-[#f8b4cb] px-2.5 py-0.5 rounded-lg shadow-sm">
              {article.kicker || 'Opinion'}
            </span>
          </div>

          {/* Draft indicator if admin */}
          {article.status === 'draft' && (
            <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow">
              Draft
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="p-5">
          {/* Clean unboxed metadata with dot separators */}
          <div className="flex items-center gap-1.5 text-xs text-[#f8b4cb] mb-2 font-sans font-semibold">
            <span className="uppercase tracking-wider">{article.categoryName}</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="text-stone-300 font-normal">{article.publishedAt}</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="text-stone-300 font-normal">{article.readTimeMinutes} min read</span>
          </div>

          {/* Headline */}
          <h3
            onClick={() => onSelectArticle(article)}
            className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#f8b4cb] transition-colors leading-snug cursor-pointer mb-2.5 line-clamp-2"
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[#BA6E8F]/20 flex items-center justify-between text-xs text-stone-400">
        {/* Heart reaction */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => likeArticle(article.id)}
            className={`flex items-center gap-1 transition-colors ${
              isLiked ? 'text-[#f8b4cb] font-bold' : 'hover:text-[#f8b4cb]'
            }`}
            title="Appreciate with a heart"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#f8b4cb] text-[#f8b4cb]' : 'text-[#f8b4cb]'}`} />
            <span className="font-mono tabular-nums">{article.likes}</span>
          </button>

          {/* Comment count */}
          <button
            onClick={() => onSelectArticle(article)}
            className="flex items-center gap-1 hover:text-[#f8b4cb] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#f8b4cb]" />
            <span className="font-mono tabular-nums">{article.comments?.length || 0}</span>
          </button>
        </div>

        {/* Controls: Bookmark & Admin edits */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleBookmark(article.id)}
            className={`p-1.5 rounded-lg hover:bg-[#5D3C64]/30 transition-colors ${
              isBookmarked ? 'text-[#f8b4cb]' : 'hover:text-white'
            }`}
            title={isBookmarked ? 'Remove from collection' : 'Save to collection'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#f8b4cb]' : ''}`} />
          </button>

          {isAdmin && onEditArticle && (
            <button
              onClick={() => onEditArticle(article)}
              className="p-1.5 rounded-lg hover:bg-[#BA6E8F]/30 text-stone-300 hover:text-[#f8b4cb] transition-colors"
              title="Edit article"
            >
              <Edit className="w-3.5 h-3.5 text-[#f8b4cb]" />
            </button>
          )}

          {isAdmin && onDeleteArticle && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  onDeleteArticle(article.id);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-rose-950/50 text-stone-400 hover:text-rose-400 transition-colors"
              title="Delete post"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
