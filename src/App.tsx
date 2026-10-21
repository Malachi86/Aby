/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { AuthorHero } from './components/AuthorHero';
import { CategoryFilter } from './components/CategoryFilter';
import { FeaturedLeadArticle } from './components/FeaturedLeadArticle';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PostEditorModal } from './components/PostEditorModal';
import { AdminStudioModal } from './components/AdminStudioModal';
import { BookmarksModal } from './components/BookmarksModal';
import { Footer } from './components/Footer';
import { ArticlePost } from './types';
import { Feather, PlusCircle, Sparkles, BookOpen, LayoutGrid, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    articles, 
    categories, 
    author,
    activeCategory, 
    searchQuery, 
    currentArticle, 
    setCurrentArticle,
    deleteArticle, 
    isAdmin 
  } = useBlog();

  // Navigation and dialog states
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticlePost | null>(null);

  // Filtered articles
  const publishedArticles = articles.filter(a => isAdmin ? true : a.status === 'published');
  
  const filteredArticles = publishedArticles.filter(art => {
    // Category match
    const matchesCategory = activeCategory === 'all' || art.categoryId === activeCategory;
    
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q) ||
      (art.tags && art.tags.some(t => t.toLowerCase().includes(q)))
    );

    return matchesCategory && matchesSearch;
  });

  // Featured Lead article: prioritize the one marked featured, or the first article
  const leadArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
  const secondaryArticles = filteredArticles.filter(a => a.id !== leadArticle?.id);

  const handleOpenNewPost = () => {
    setArticleToEdit(null);
    setIsPostEditorOpen(true);
  };

  const handleEditArticle = (art: ArticlePost) => {
    setArticleToEdit(art);
    setIsPostEditorOpen(true);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToAuthor = () => {
    if (currentArticle) {
      setCurrentArticle(null);
      setTimeout(() => {
        document.getElementById('author-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('author-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0420] text-stone-100 font-sans selection:bg-[#F8A5C2]/40 selection:text-slate-900">
      
      {/* Top Header */}
      <Header
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminStudio={() => {
          setCurrentArticle(null);
          setIsAdminStudioOpen(true);
        }}
        onOpenNewPost={handleOpenNewPost}
        onNavigateHome={() => {
          setCurrentArticle(null);
          handleScrollToTop();
        }}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onScrollToAuthor={handleScrollToAuthor}
      />

      {/* Prominent Author Banner when previewing public site while logged in */}
      {isAdmin && !isAdminStudioOpen && (
        <div className="sticky top-20 z-30 w-full bg-gradient-to-r from-[#1b0a24] via-[#3a1c43] to-[#1b0a24] border-b border-[#F8A5C2]/40 py-2.5 px-4 sm:px-6 shadow-lg text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-stone-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F8A5C2] animate-pulse shadow-sm" />
              <span className="font-bold text-[#F8A5C2]">Author Mode:</span>
              <span className="text-white font-medium">{author.name}</span>
              <span className="hidden md:inline text-stone-400">· You are currently viewing the live blog</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAdminStudioOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-[#F8A5C2] hover:bg-[#f59ebc] text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#F8A5C2]/20 active:scale-95"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-950" />
                <span>Return to Admin Dashboard</span>
              </button>
              <button
                onClick={handleOpenNewPost}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5D3C64]/70 hover:bg-[#5D3C64] text-white font-semibold transition-all border border-[#F8A5C2]/30"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#F8A5C2]" />
                <span>+ Write Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View: Article Reader OR Public Homepage */}
      {currentArticle ? (
        <ArticleReader
          article={currentArticle}
          onBack={() => {
            setCurrentArticle(null);
            handleScrollToTop();
          }}
          onReturnToAdmin={() => {
            setCurrentArticle(null);
            setIsAdminStudioOpen(true);
          }}
          onSelectRelated={(related) => setCurrentArticle(related)}
          onEditArticle={handleEditArticle}
        />
      ) : (
        <main className="flex-1">
          {/* Author Banner & Hero */}
          <AuthorHero
            onEditProfile={() => setIsAdminStudioOpen(true)}
            onExplorePosts={() => {
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Interactive Category Filter Bar */}
          <CategoryFilter
            onOpenAddCategory={() => setIsAdminStudioOpen(true)}
          />

          {/* Catalog & Feed Section */}
          <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
            
            {/* Search or Filter Active Notice */}
            {(activeCategory !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1b0a24]/80 border border-[#BA6E8F]/40 shadow-sm">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-300">
                    Filtered by:
                  </span>
                  {activeCategory !== 'all' && (
                    <span className="font-bold text-[#F8A5C2] bg-[#BA6E8F]/25 px-2.5 py-0.5 rounded-lg border border-[#F8A5C2]/30">
                      {categories.find(c => c.id === activeCategory)?.name}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="font-bold text-[#F8A5C2] bg-[#5D3C64]/50 px-2.5 py-0.5 rounded-lg">
                      "{searchQuery}"
                    </span>
                  )}
                  <span className="text-stone-400 font-mono">
                    ({filteredArticles.length} results)
                  </span>
                </div>

                <button
                  onClick={() => {
                    // Reset filters
                  }}
                  className="text-xs text-[#F8A5C2] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {filteredArticles.length > 0 ? (
              <>
                {/* Tier 1: Lead Marquee Feature */}
                {leadArticle && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F8A5C2] uppercase tracking-wider mb-4 font-sans">
                      <Sparkles className="w-4 h-4 text-[#F8A5C2]" />
                      <span>Featured Article</span>
                    </div>

                    <FeaturedLeadArticle
                      article={leadArticle}
                      onSelectArticle={(art) => setCurrentArticle(art)}
                      onEditArticle={handleEditArticle}
                    />
                  </div>
                )}

                {/* Tier 2: Secondary Features Grid */}
                {secondaryArticles.length > 0 && (
                  <div className="pt-6">
                    <div className="flex items-center justify-between mb-6 border-b border-[#BA6E8F]/30 pb-3">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                        <BookOpen className="w-5 h-5 text-[#F8A5C2]" />
                        <span>More Articles</span>
                      </h2>
                      <span className="text-xs font-mono text-[#F8A5C2] font-semibold">
                        {secondaryArticles.length} articles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {secondaryArticles.map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          onSelectArticle={(selected) => setCurrentArticle(selected)}
                          onEditArticle={handleEditArticle}
                          onDeleteArticle={deleteArticle}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="py-20 text-center rounded-3xl border border-dashed border-[#BA6E8F]/40 bg-[#1b0a24]/30 p-8">
                <Feather className="w-12 h-12 text-[#BA6E8F] mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  No articles found
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-6">
                  There are no articles matching your filter or search query. Try selecting another category or searching with different keywords.
                </p>
                {isAdmin && (
                  <button
                    onClick={handleOpenNewPost}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Write an Article Now</span>
                  </button>
                )}
              </div>
            )}

          </section>
        </main>
      )}

      {/* Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminStudio={() => setIsAdminStudioOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminStudioOpen(true)}
      />

      {/* Post Editor Modal (New / Edit) */}
      <PostEditorModal
        isOpen={isPostEditorOpen}
        onClose={() => {
          setIsPostEditorOpen(false);
          setArticleToEdit(null);
        }}
        articleToEdit={articleToEdit}
      />

      {/* Admin Studio Dashboard (Sidebar view inspired by fe2865a3) */}
      <AdminStudioModal
        isOpen={isAdminStudioOpen}
        onClose={() => setIsAdminStudioOpen(false)}
        onOpenNewPost={handleOpenNewPost}
        onEditArticle={handleEditArticle}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectArticle={(art) => {
          setCurrentArticle(art);
          setIsBookmarksOpen(false);
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <BlogProvider>
      <MainAppContent />
    </BlogProvider>
  );
}
