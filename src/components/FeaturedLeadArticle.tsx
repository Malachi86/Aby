import React from 'react';
import { ArticlePost } from '../types';
import { useBlog } from '../context/BlogContext';
import { 
  Bookmark, 
  Clock, 
  Edit, 
  Eye, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface FeaturedLeadArticleProps {
  article: ArticlePost;
  onSelectArticle: (article: ArticlePost) => void;
  onEditArticle?: (article: ArticlePost) => void;
}

export const FeaturedLeadArticle: React.FC<FeaturedLeadArticleProps> = ({
  article,
  onSelectArticle,
  onEditArticle,
}) => {
  const { likeArticle, likedPosts, toggleBookmark, bookmarks, isAdmin, author } = useBlog();
  const isLiked = likedPosts.includes(article.id);
  const isBookmarked = bookmarks.includes(article.id);

  return (
    <article className="group relative w-full rounded-3xl overflow-hidden border border-[#BA6E8F]/40 bg-gradient-to-b from-[#240e32] to-[#0C0420] shadow-xl hover:border-[#f8b4cb] hover:shadow-2xl hover:shadow-[#BA6E8F]/20 transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Visual Slot - 7 Cols */}
        <div 
          onClick={() => onSelectArticle(article)}
          className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden cursor-pointer"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/editorial_manila_dusk_1792570804269.jpg';
            }}
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0420] via-[#0C0420]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0C0420]" />
          
          {/* Top highlight kicker */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-950 bg-[#f8b4cb] px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0C0420]" />
              <span>{article.kicker || 'Featured Article'}</span>
            </span>
          </div>

          {article.coverCaption && (
            <p className="absolute bottom-3 left-4 right-4 text-[11px] font-body italic text-[#f8b4cb]/80 line-clamp-1 pointer-events-none">
              {article.coverCaption}
            </p>
          )}
        </div>

        {/* Story Text Content - 5 Cols */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Clean unboxed metadata with pink accents */}
            <div className="flex items-center gap-2 text-xs text-[#f8b4cb] mb-3 font-sans">
              <span className="font-bold text-[#f8b4cb] uppercase tracking-wider">{article.categoryName}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="text-stone-300">{article.publishedAt}</span>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <span className="flex items-center gap-1 text-stone-300">
                <Clock className="w-3 h-3 text-[#f8b4cb]" />
                <span>{article.readTimeMinutes} min read</span>
              </span>
            </div>

            {/* Headline */}
            <h2
              onClick={() => onSelectArticle(article)}
              className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#f8b4cb] transition-colors cursor-pointer leading-tight mb-4 text-wrap-balance"
            >
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-stone-300 font-body leading-relaxed mb-6 line-clamp-4">
              {article.excerpt}
            </p>
          </div>

          {/* Card Footer: Author byline & interactive reaction controls */}
          <div className="pt-4 border-t border-[#BA6E8F]/25 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              {/* Author byline */}
              <div className="flex items-center gap-2.5">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#f8b4cb]"
                />
                <span className="text-xs font-semibold text-white">
                  {author.name}
                </span>
              </div>

              {/* Read button */}
              <button
                onClick={() => onSelectArticle(article)}
                className="text-xs font-bold text-[#f8b4cb] hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactions bar */}
            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-4">
                {/* Heart / Like button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likeArticle(article.id);
                  }}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isLiked ? 'text-[#f8b4cb] font-bold' : 'hover:text-[#f8b4cb]'
                  }`}
                  title="Appreciate with a heart"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#f8b4cb] text-[#f8b4cb]' : 'text-[#f8b4cb]'}`} />
                  <span className="font-mono tabular-nums">{article.likes}</span>
                </button>

                {/* Comments count */}
                <button
                  onClick={() => onSelectArticle(article)}
                  className="flex items-center gap-1.5 hover:text-[#f8b4cb] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#f8b4cb]" />
                  <span className="font-mono tabular-nums">{article.comments?.length || 0}</span>
                </button>

                {/* Views */}
                <div className="flex items-center gap-1 text-stone-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="font-mono tabular-nums">{article.views}</span>
                </div>
              </div>

              {/* Bookmark & Admin Edit */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(article.id);
                  }}
                  className={`p-1.5 rounded-lg hover:bg-[#5D3C64]/40 transition-colors ${
                    isBookmarked ? 'text-[#f8b4cb]' : 'hover:text-white'
                  }`}
                  title={isBookmarked ? 'Saved in collection' : 'Save to collection'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#f8b4cb]' : ''}`} />
                </button>

                {isAdmin && onEditArticle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditArticle(article);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#BA6E8F]/30 text-stone-300 hover:text-[#f8b4cb] transition-colors"
                    title="Edit article"
                  >
                    <Edit className="w-4 h-4 text-[#f8b4cb]" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
