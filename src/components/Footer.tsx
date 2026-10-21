import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Feather, ArrowUp, Heart } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onOpenAdminLogin,
  onOpenAdminStudio,
}) => {
  const { author, categories, isAdmin, setActiveCategory } = useBlog();

  return (
    <footer className="w-full border-t border-[#BA6E8F]/25 bg-[#0C0420] text-stone-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#BA6E8F]/20">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F8A5C2] via-[#BA6E8F] to-[#5D3C64] p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0C0420] rounded-[14px] flex items-center justify-center">
                  <Feather className="w-5 h-5 text-[#F8A5C2]" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                PANANAW
              </span>
            </div>
            <p className="text-xs sm:text-sm font-body text-stone-300 leading-relaxed max-w-sm">
              An intimate sanctuary for long-form essays, incisive editorial columns, and cultural commentary with a luxurious reading experience.
            </p>
            <p className="text-xs text-[#F8A5C2] font-sans font-semibold">
              Authored & edited by <span className="text-white font-bold">{author.name}</span> · {author.columnName}
            </p>
          </div>

          {/* Quick Categories Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8A5C2] font-sans">
              Editorial Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      onScrollToTop();
                    }}
                    className="hover:text-[#F8A5C2] transition-colors flex items-center gap-2 text-stone-300"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Author & Admin Access */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8A5C2] font-sans">
              Editorial Administration
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Single-author portal. Exclusive access for Ruby to write, edit articles, categorize topics, and manage visitor feedback.
            </p>
            <div className="pt-2">
              {isAdmin ? (
                <button
                  onClick={onOpenAdminStudio}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <span>Open Admin Dashboard &rarr;</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="px-4 py-2 text-xs font-semibold text-[#F8A5C2] hover:text-white bg-[#BA6E8F]/20 hover:bg-[#BA6E8F]/40 border border-[#F8A5C2]/40 rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Author Sign In &rarr;</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-sans">
          <p>© {new Date().getFullYear()} Pananaw — {author.name}. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-[#F8A5C2] font-medium">
              <Heart className="w-3.5 h-3.5 fill-[#F8A5C2]" />
              Crafted for graceful writing and deep reading
            </span>
            <button
              onClick={onScrollToTop}
              className="p-2.5 rounded-xl bg-[#1b0a24] hover:bg-[#2d1338] border border-[#BA6E8F]/30 text-stone-300 hover:text-white transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-[#F8A5C2]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
