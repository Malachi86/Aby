import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { 
  Bookmark, 
  Feather, 
  LayoutGrid,
  Lock, 
  LogOut, 
  PlusCircle, 
  Search, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  onOpenAdminLogin: () => void;
  onOpenAdminStudio: () => void;
  onOpenNewPost: () => void;
  onNavigateHome: () => void;
  onOpenBookmarks: () => void;
  onScrollToAuthor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminLogin,
  onOpenAdminStudio,
  onOpenNewPost,
  onNavigateHome,
  onOpenBookmarks,
  onScrollToAuthor,
}) => {
  const { 
    isAdmin, 
    logoutAdmin, 
    bookmarks, 
    theme, 
    setTheme, 
    searchQuery, 
    setSearchQuery,
    author 
  } = useBlog();

  const [showSearch, setShowSearch] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('sepia');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-[#BA6E8F]/25 bg-[#0C0420]/95 text-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="group text-left flex items-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f8b4cb]"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f8b4cb] via-[#BA6E8F] to-[#5D3C64] p-0.5 shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0C0420] rounded-[14px] flex items-center justify-center">
                <Feather className="w-5 h-5 text-[#f8b4cb] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#f8b4cb] transition-colors whitespace-nowrap block">
                PANANAW
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#f8b4cb] font-sans block -mt-1 font-semibold">
                {author.columnName}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line nav links (English) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#f8b4cb] transition-colors whitespace-nowrap py-1 relative hover:underline decoration-[#f8b4cb] decoration-2 underline-offset-8"
          >
            Editorials
          </button>
          <button
            onClick={onScrollToAuthor}
            className="hover:text-[#f8b4cb] transition-colors whitespace-nowrap py-1 hover:underline decoration-[#f8b4cb] decoration-2 underline-offset-8"
          >
            About Author
          </button>
          <button
            onClick={onOpenBookmarks}
            className="hover:text-[#f8b4cb] transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 hover:underline decoration-[#f8b4cb] decoration-2 underline-offset-8"
          >
            <Bookmark className="w-4 h-4 text-[#f8b4cb]" />
            <span>Collection</span>
            {bookmarks.length > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-[#BA6E8F] text-white rounded-full font-bold">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Quick search input */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search essays, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearch(false);
                  }}
                  className="w-56 px-3.5 py-1.5 text-xs bg-[#240e32] border border-[#BA6E8F]/60 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#f8b4cb] focus:ring-1 focus:ring-[#f8b4cb] transition-all"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  className="absolute right-2.5 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-stone-300 hover:text-[#f8b4cb] flex items-center gap-1.5 text-sm py-1 transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 text-[#f8b4cb]" />
                <span className="text-xs">Search</span>
              </button>
            )}
          </div>
        </nav>

        {/* Zone 3: 1 Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-[#5D3C64]/40 border border-[#BA6E8F]/30 transition-colors"
            title={`Reading Theme: ${theme === 'dark' ? 'Obsidian Plum' : theme === 'sepia' ? 'Warm Sepia' : 'Paper White'}`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#f8b4cb]" />
            ) : theme === 'sepia' ? (
              <BookOpen className="w-4 h-4 text-[#BA6E8F]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Admin Action Button */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminStudio}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-md shadow-[#F8A5C2]/20 transition-all whitespace-nowrap shrink-0 active:scale-95"
                title="Open Admin Dashboard"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-950" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={onOpenNewPost}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#BA6E8F] hover:bg-[#9F6496] active:scale-95 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Post</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="p-2 rounded-xl bg-[#0C0420] hover:bg-rose-950/50 border border-stone-800 text-stone-400 hover:text-rose-300 transition-colors"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-[#F8A5C2]/20 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span>Author Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
