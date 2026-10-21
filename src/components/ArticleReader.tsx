import React, { useEffect, useRef, useState } from 'react';
import { ArticlePost, Comment } from '../types';
import { useBlog } from '../context/BlogContext';
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Copy, 
  Edit, 
  Heart, 
  MessageSquare, 
  Play, 
  Pause, 
  Square, 
  Share2, 
  Volume2, 
  Sparkles, 
  Check, 
  Send, 
  Trash2, 
  User, 
  Eye, 
  BookOpen, 
  LayoutGrid,
  Moon, 
  Sun,
  Type
} from 'lucide-react';

interface ArticleReaderProps {
  article: ArticlePost;
  onBack: () => void;
  onSelectRelated: (article: ArticlePost) => void;
  onEditArticle?: (article: ArticlePost) => void;
  onReturnToAdmin?: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onSelectRelated,
  onEditArticle,
  onReturnToAdmin,
}) => {
  const { 
    articles, 
    likeArticle, 
    likedPosts, 
    toggleBookmark, 
    bookmarks, 
    addComment, 
    likeComment, 
    deleteComment, 
    isAdmin, 
    author,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    incrementViews
  } = useBlog();

  // Scroll reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  const articleContentRef = useRef<HTMLDivElement>(null);

  // Comments form state
  const [commentName, setCommentName] = useState(isAdmin ? author.name : '');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  // Audio Speech Reader State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isLiked = likedPosts.includes(article.id);
  const isBookmarked = bookmarks.includes(article.id);

  // Count views once on open
  useEffect(() => {
    incrementViews(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text to speech controls
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support audio speech narration.');
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Prepare clean text without markdown symbols
    const cleanText = `${article.title}. ${article.excerpt}. ${article.content.replace(/[#*`>_-]/g, '')}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const handleHeartClick = () => {
    likeArticle(article.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 900);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(article.id, commentName || (isAdmin ? author.name : 'Reader'), commentText);
    setCommentText('');
  };

  // Related articles (same category or recent)
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base leading-relaxed';
      case 'lg': return 'text-xl leading-loose';
      case 'xl': return 'text-2xl leading-loose';
      case 'md':
      default: return 'text-lg leading-relaxed';
    }
  };

  // Reader theme container classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return {
          wrapper: 'bg-[#F4ECE1] text-[#2c1d11]',
          surface: 'bg-[#EFE5D6] border-[#D9C7B2]',
          accentText: 'text-[#BA6E8F]',
          mutedText: 'text-[#6e5d4e]',
          card: 'bg-[#EAE0D0] border-[#D6C2AC]',
        };
      case 'light':
        return {
          wrapper: 'bg-[#FAF5F7] text-[#1a1523]',
          surface: 'bg-white border-pink-100 shadow-xs',
          accentText: 'text-[#BA6E8F]',
          mutedText: 'text-stone-600',
          card: 'bg-white border-pink-100',
        };
      case 'dark':
      default:
        return {
          wrapper: 'bg-[#0C0420] text-stone-100',
          surface: 'bg-[#200d27]/90 border-[#BA6E8F]/30',
          accentText: 'text-[#f8b4cb]',
          mutedText: 'text-stone-300',
          card: 'bg-[#200d27] border-[#BA6E8F]/30',
        };
    }
  };

  const themeStyles = getThemeClasses();

  // Helper to parse inline markdown (bold, italic, links)
  const parseInlineMarkdown = (text: string) => {
    // Split by markdown tokens
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-inherit">{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F8A5C2] hover:underline underline-offset-4 font-semibold"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Helper to render rich markdown paragraphs with blockquotes and headings
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n\n');

    return lines.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-10 mb-4 pt-4 border-t border-current/15 text-inherit"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="font-serif text-xl sm:text-2xl font-bold mt-8 mb-3 text-inherit"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Pull quote / Blockquote
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/, '');
        return (
          <figure
            key={idx}
            className="my-8 py-5 px-6 border-l-4 border-[#F8A5C2] bg-[#BA6E8F]/15 rounded-r-2xl shadow-xs"
          >
            <blockquote className="font-serif italic text-xl sm:text-2xl font-normal leading-relaxed text-[#F8A5C2]">
              {parseInlineMarkdown(quoteText)}
            </blockquote>
          </figure>
        );
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(Boolean);
        return (
          <ul key={idx} className="my-5 space-y-2.5 list-disc list-inside">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed">
                <span className="font-body">{parseInlineMarkdown(item.replace(/^[-*]\s*/, ''))}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter(Boolean);
        return (
          <ol key={idx} className="my-5 space-y-3 list-decimal list-inside">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed font-body">
                <span>{parseInlineMarkdown(item.replace(/^\d+\.\s*/, ''))}</span>
              </li>
            ))}
          </ol>
        );
      }

      // Standard paragraph (with pink drop-cap on the first paragraph)
      return (
        <p
          key={idx}
          className={`font-body mb-6 ${idx === 0 ? 'editorial-drop-cap' : ''}`}
        >
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeStyles.wrapper}`}>
      
      {/* Top Reading Progress Bar (Pink Gradient) */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-black/20">
        <div
          className="h-full bg-gradient-to-r from-[#BA6E8F] via-[#f8b4cb] to-[#D391B0] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Reader Top Ribbon */}
      <div className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors border-current/10 bg-inherit/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Back button & Admin Shortcut */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold hover:text-[#f8b4cb] transition-colors py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Pananaw</span>
              <span className="sm:hidden">Back</span>
            </button>

            {isAdmin && onReturnToAdmin && (
              <button
                onClick={onReturnToAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#f8b4cb] text-slate-950 rounded-xl shadow-xs hover:bg-[#f59ebc] transition-all ml-2"
                title="Return to Admin Dashboard"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-950" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          {/* Reader Preferences Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Audio Speech Narration Button */}
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-[#f8b4cb] text-slate-950 font-bold shadow-sm'
                  : 'hover:bg-[#BA6E8F]/20 text-[#f8b4cb]'
              }`}
              title={isSpeaking ? (isPaused ? 'Resume listening' : 'Pause speech') : 'Listen to Editorial (Audio Narrator)'}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-4 h-4 text-slate-950" />
                  <span className="hidden md:inline font-sans">Pause</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden md:inline font-sans">Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#f8b4cb]" />
                  <span className="hidden md:inline font-sans font-semibold">Listen</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 text-xs"
                title="Stop narration"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Font Size Selector */}
            <div className="flex items-center border border-current/20 rounded-xl p-0.5">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-[#f8b4cb] text-slate-950 font-bold' : 'hover:opacity-75'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${fontSize === 'md' ? 'bg-[#f8b4cb] text-slate-950 font-bold' : 'hover:opacity-75'}`}
                title="Medium text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-[#f8b4cb] text-slate-950 font-bold' : 'hover:opacity-75'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center border border-current/20 rounded-xl p-0.5">
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-[#f8b4cb] text-slate-950' : 'hover:opacity-75'}`}
                title="Dark (Obsidian Plum)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-lg transition-colors ${theme === 'sepia' ? 'bg-[#BA6E8F] text-white' : 'hover:opacity-75'}`}
                title="Sepia (Warm Paper)"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-[#BA6E8F] text-white' : 'hover:opacity-75'}`}
                title="Light"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-xl border border-current/20 hover:bg-[#BA6E8F]/20 transition-colors ${
                isBookmarked ? 'text-[#f8b4cb]' : ''
              }`}
              title={isBookmarked ? 'Saved in collection' : 'Save to collection'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#f8b4cb]' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-current/20 hover:bg-[#BA6E8F]/20 transition-colors relative"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Admin Edit button */}
            {isAdmin && onEditArticle && (
              <button
                onClick={() => onEditArticle(article)}
                className="p-2 rounded-xl bg-[#f8b4cb] text-slate-950 font-bold hover:bg-[#f59ebc] transition-colors"
                title="Edit this post"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        
        {/* Article Header & Curatorial Kicker */}
        <header className="mb-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-[#f8b4cb] font-sans mb-4">
            <span className="font-bold text-[#f8b4cb] uppercase tracking-widest bg-[#BA6E8F]/20 px-2.5 py-0.5 rounded-full border border-[#f8b4cb]/30">
              {article.kicker || 'Editorial'}
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#5D3C64]/40 text-white">
              {article.categoryName}
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="flex items-center gap-1 opacity-80 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-[#f8b4cb]" />
              <span>{article.readTimeMinutes} min read</span>
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="opacity-80 text-stone-300">{article.publishedAt}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6 text-wrap-balance">
            {article.title}
          </h1>

          <p className="font-serif italic text-lg sm:text-xl leading-relaxed opacity-90 mb-8 border-l-4 border-[#f8b4cb] pl-5 text-[#f8b4cb]">
            {article.excerpt}
          </p>

          {/* Author Byline Lockup */}
          <div className="flex items-center justify-between py-4 border-y border-current/15 gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#f8b4cb]"
              />
              <div>
                <span className="font-serif font-bold text-sm sm:text-base block">
                  {author.name}
                </span>
                <span className="text-xs text-[#f8b4cb] block font-sans font-medium">
                  {author.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-80">
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-[#f8b4cb]" />
                <span>{article.views.toLocaleString()} readers</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {article.coverImage && (
          <div className="my-8 rounded-3xl overflow-hidden border border-[#BA6E8F]/30 shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[480px] object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/images/editorial_manila_dusk_1792570804269.jpg';
              }}
            />
            {article.coverCaption && (
              <p className="py-3 px-5 text-xs font-serif italic text-[#f8b4cb]/80 border-t border-current/10 bg-[#0C0420]/80">
                {article.coverCaption}
              </p>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <div 
          ref={articleContentRef}
          className={`prose max-w-none transition-all ${getFontSizeClass()}`}
        >
          {renderFormattedContent(article.content)}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-current/15 flex flex-wrap items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-wider text-[#f8b4cb] mr-2 font-bold">
              Topics:
            </span>
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-[#BA6E8F]/20 border border-[#f8b4cb]/30 text-[#f8b4cb] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Heart / Reaction Interaction Bar */}
        <section className="mt-12 p-8 rounded-3xl border border-[#f8b4cb]/40 bg-gradient-to-r from-[#200d27] via-[#3a1c43] to-[#200d27] text-center relative overflow-hidden shadow-xl shadow-[#BA6E8F]/15">
          {/* Animated floating hearts on click */}
          {heartAnim && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-ping">
              <Heart className="w-28 h-28 text-[#f8b4cb] fill-[#f8b4cb] opacity-50" />
            </div>
          )}

          <h3 className="font-serif text-2xl font-bold mb-2 text-white">
            Did you resonate with this essay?
          </h3>
          <p className="text-xs sm:text-sm text-[#f8b4cb]/90 max-w-md mx-auto mb-6">
            Press the heart to express appreciation to the author and help support independent, thoughtful cultural journalism.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleHeartClick}
              className={`group flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-bold transition-all transform active:scale-95 shadow-lg ${
                isLiked
                  ? 'bg-[#f8b4cb] text-slate-950 ring-4 ring-[#f8b4cb]/40'
                  : 'bg-gradient-to-r from-[#f8b4cb] via-[#BA6E8F] to-[#f8b4cb] text-slate-950'
              }`}
            >
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-125 ${isLiked ? 'fill-slate-950 text-slate-950' : 'text-slate-950 fill-slate-950'}`} />
              <span className="font-mono text-base tabular-nums">{article.likes}</span>
              <span>{isLiked ? 'Appreciated!' : 'Appreciate Essay'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f8b4cb] transition-colors"
              title="Share essay"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Author Footer Card */}
        <section className="mt-12 p-7 rounded-3xl border border-[#BA6E8F]/30 bg-[#200d27]/40 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#f8b4cb] shrink-0"
          />
          <div>
            <div className="text-xs font-bold text-[#f8b4cb] uppercase tracking-wider mb-1">
              About the Author
            </div>
            <h4 className="font-serif text-xl font-bold text-white mb-1">{author.name}</h4>
            <p className="text-xs text-[#f8b4cb] mb-3 font-semibold">{author.title}</p>
            <p className="text-xs sm:text-sm font-body leading-relaxed text-stone-300 mb-4">
              {author.bio}
            </p>
            <a
              href={`mailto:${author.email}`}
              className="text-xs font-bold text-[#f8b4cb] hover:underline"
            >
              Write to Aby &rarr;
            </a>
          </div>
        </section>

        {/* Interactive Visitor Comments Section */}
        <section className="mt-16 pt-10 border-t border-current/15" id="comments-section">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#f8b4cb]" />
              <h3 className="font-serif text-2xl font-bold text-white">
                Comments & Reflections ({article.comments?.length || 0})
              </h3>
            </div>
          </div>

          {/* New Comment Submission Form */}
          <form
            onSubmit={handleSubmitComment}
            className="mb-10 p-6 rounded-2xl border border-[#BA6E8F]/30 bg-[#200d27]/40 shadow-xs"
          >
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#f8b4cb] mb-1.5">
                Your Name or Alias
              </label>
              <input
                type="text"
                placeholder={isAdmin ? `${author.name} (Author)` : 'e.g., Alexandra Cruz'}
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#0C0420]/60 border border-[#BA6E8F]/40 rounded-xl focus:outline-none focus:border-[#f8b4cb] focus:ring-1 focus:ring-[#f8b4cb] text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#f8b4cb] mb-1.5">
                Your Thought or Reflection
              </label>
              <textarea
                rows={3}
                placeholder="What are your thoughts on this editorial? Share your perspective..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm bg-[#0C0420]/60 border border-[#BA6E8F]/40 rounded-xl focus:outline-none focus:border-[#f8b4cb] focus:ring-1 focus:ring-[#f8b4cb] text-white resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-[#f8b4cb] hover:bg-[#f59ebc] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Comment</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-5 rounded-2xl border transition-colors ${
                    comment.isAuthor
                      ? 'border-[#f8b4cb] bg-[#BA6E8F]/20'
                      : 'border-[#BA6E8F]/20 bg-[#200d27]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#BA6E8F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {comment.authorName[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {comment.authorName}
                          </span>
                          {comment.isAuthor && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f8b4cb] text-slate-950 px-2 py-0.2 rounded-full">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {comment.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Like comment button */}
                      <button
                        onClick={() => likeComment(article.id, comment.id)}
                        className="flex items-center gap-1 text-xs hover:text-[#f8b4cb] transition-colors p-1"
                        title="Like comment"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#f8b4cb]" />
                        <span className="font-mono tabular-nums">{comment.likes}</span>
                      </button>

                      {/* Admin delete comment */}
                      {isAdmin && (
                        <button
                          onClick={() => deleteComment(article.id, comment.id)}
                          className="p-1 text-stone-400 hover:text-rose-400 transition-colors"
                          title="Delete comment (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-body leading-relaxed pl-12 text-stone-200">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border border-dashed border-[#BA6E8F]/30 rounded-2xl">
                <p className="text-sm text-stone-400">
                  No reflections yet. Be the first to share your perspective!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Reading (Related Articles) */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-10 border-t border-current/15">
            <h3 className="font-serif text-2xl font-bold mb-6 text-white">
              Recommended Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-[#BA6E8F]/25 bg-[#200d27]/40 hover:border-[#f8b4cb] transition-all p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-black/20">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#f8b4cb] uppercase tracking-wider block mb-1">
                      {rel.categoryName}
                    </span>
                    <h4 className="font-serif text-base font-bold text-white line-clamp-2 group-hover:text-[#f8b4cb] transition-colors leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-3 font-sans">
                    <span>{rel.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono text-[#f8b4cb]">
                      <Heart className="w-3 h-3 fill-[#f8b4cb]" />
                      {rel.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

    </div>
  );
};
