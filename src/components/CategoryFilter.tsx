import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Filter, Plus, Search, Tag } from 'lucide-react';

interface CategoryFilterProps {
  onOpenAddCategory?: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ onOpenAddCategory }) => {
  const { 
    categories, 
    activeCategory, 
    setActiveCategory, 
    articles, 
    searchQuery, 
    setSearchQuery,
    isAdmin 
  } = useBlog();

  const publishedArticles = articles.filter(a => a.status === 'published');

  return (
    <section className="w-full border-b border-[#BA6E8F]/20 bg-[#0C0420]/90 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {/* All Articles Tab */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs ${
                activeCategory === 'all'
                  ? 'bg-[#f8b4cb] text-slate-950 font-bold shadow-md'
                  : 'bg-[#240e32]/60 text-stone-300 hover:text-white hover:bg-[#3a1c43] border border-[#BA6E8F]/30'
              }`}
            >
              <span>All Articles</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeCategory === 'all' ? 'bg-black/15 text-slate-950 font-bold' : 'bg-[#BA6E8F]/30 text-[#f8b4cb]'
              }`}>
                {publishedArticles.length}
              </span>
            </button>

            {/* Individual Categories */}
            {categories.map((cat) => {
              const count = publishedArticles.filter(a => a.categoryId === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#BA6E8F] text-white shadow-md ring-2 ring-[#f8b4cb]'
                      : 'bg-[#240e32]/60 text-stone-300 hover:text-white hover:bg-[#3a1c43] border border-[#BA6E8F]/30'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-black/20 text-white font-bold' : 'bg-[#BA6E8F]/30 text-[#f8b4cb]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Admin Add Category Quick Button */}
            {isAdmin && onOpenAddCategory && (
              <button
                onClick={onOpenAddCategory}
                className="px-3.5 py-2 text-xs font-semibold text-[#f8b4cb] hover:text-white bg-[#BA6E8F]/20 hover:bg-[#BA6E8F]/40 border border-dashed border-[#f8b4cb]/60 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                title="Add a new category"
              >
                <Plus className="w-3.5 h-3.5 text-[#f8b4cb]" />
                <span>+ Category</span>
              </button>
            )}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#f8b4cb] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#240e32]/70 border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#f8b4cb] focus:ring-1 focus:ring-[#f8b4cb] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
