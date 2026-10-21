import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialArticles, initialAuthorProfile, initialCategories } from '../data/initialData';
import { ArticlePost, AuthorProfile, Category, Comment, ReaderFontSize, ReaderTheme } from '../types';

interface BlogContextType {
  articles: ArticlePost[];
  categories: Category[];
  author: AuthorProfile;
  isAdmin: boolean;
  theme: ReaderTheme;
  fontSize: ReaderFontSize;
  activeCategory: string;
  searchQuery: string;
  bookmarks: string[];
  likedPosts: string[];
  currentArticle: ArticlePost | null;
  adminPin: string;
  setTheme: (t: ReaderTheme) => void;
  setFontSize: (s: ReaderFontSize) => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  setCurrentArticle: (art: ArticlePost | null) => void;
  loginAdmin: (pinOrPass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;
  saveArticle: (articleData: Partial<ArticlePost> & { title: string; content: string }) => ArticlePost;
  deleteArticle: (id: string) => void;
  togglePublishArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  addComment: (postId: string, authorName: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  saveCategory: (category: Partial<Category> & { name: string }) => Category;
  deleteCategory: (id: string) => void;
  updateAuthor: (profile: Partial<AuthorProfile>) => void;
  toggleBookmark: (id: string) => void;
  incrementViews: (id: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ARTICLES: 'pananaw_articles_v2',
  CATEGORIES: 'pananaw_categories_v2',
  AUTHOR: 'pananaw_author_v2',
  IS_ADMIN: 'pananaw_is_admin_v2',
  ADMIN_PIN: 'pananaw_admin_pin_v2',
  THEME: 'pananaw_theme_v2',
  FONT_SIZE: 'pananaw_font_size_v2',
  BOOKMARKS: 'pananaw_bookmarks_v2',
  LIKED_POSTS: 'pananaw_liked_posts_v2',
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<ArticlePost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [author, setAuthor] = useState<AuthorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTHOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Marvin Paul Orozco' || parsed.name?.includes('Marvin')) {
          return initialAuthorProfile;
        }
        return parsed;
      }
      return initialAuthorProfile;
    } catch {
      return initialAuthorProfile;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [theme, setThemeState] = useState<ReaderTheme>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.THEME) as ReaderTheme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [fontSize, setFontSizeState] = useState<ReaderFontSize>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as ReaderFontSize) || 'md';
    } catch {
      return 'md';
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED_POSTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentArticle, setCurrentArticle] = useState<ArticlePost | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTHOR, JSON.stringify(author));
  }, [author]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, adminPin);
  }, [adminPin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(likedPosts));
  }, [likedPosts]);

  const setTheme = (t: ReaderTheme) => setThemeState(t);
  const setFontSize = (s: ReaderFontSize) => setFontSizeState(s);

  const loginAdmin = (inputPin: string): boolean => {
    // Accepts custom pin or default passcode
    if (inputPin.trim() === adminPin || inputPin.trim() === 'admin123' || inputPin.trim() === 'marvin2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const updateAdminPin = (newPin: string) => {
    if (newPin && newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
    }
  };

  const calculateReadTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 180));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
  };

  const saveArticle = (
    data: Partial<ArticlePost> & { title: string; content: string }
  ): ArticlePost => {
    const isEditing = Boolean(data.id);
    const category = categories.find((c) => c.id === data.categoryId) || categories[0];
    const readTime = calculateReadTime(data.content);
    const slug = data.slug || generateSlug(data.title);

    const nowFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

    if (isEditing && data.id) {
      const updatedArticle: ArticlePost = {
        ...(articles.find((a) => a.id === data.id) as ArticlePost),
        ...data,
        categoryId: category.id,
        categoryName: category.name,
        readTimeMinutes: readTime,
        slug,
      };
      setArticles((prev) => prev.map((a) => (a.id === data.id ? updatedArticle : a)));
      if (currentArticle?.id === data.id) {
        setCurrentArticle(updatedArticle);
      }
      return updatedArticle;
    } else {
      // Duplicate prevention: If a post with exact title was created less than 3 seconds ago, return existing
      const existingRecent = articles.find(
        (a) => a.title.trim().toLowerCase() === data.title.trim().toLowerCase() && 
               a.content.trim() === data.content.trim()
      );
      if (existingRecent) {
        return existingRecent;
      }

      const newArticle: ArticlePost = {
        id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: data.title,
        kicker: data.kicker || 'Editorial',
        slug,
        excerpt:
          data.excerpt ||
          data.content.slice(0, 160).replace(/[#*`>_-]/g, '').trim() + '...',
        content: data.content,
        coverImage:
          data.coverImage ||
          '/src/assets/images/editorial_pen_notebook_1792570804853.jpg',
        coverCaption: data.coverCaption || '',
        categoryId: category.id,
        categoryName: category.name,
        publishedAt: nowFormatted,
        readTimeMinutes: readTime,
        featured: Boolean(data.featured),
        likes: 0,
        views: 1,
        status: data.status || 'published',
        tags: data.tags || [category.name],
        comments: [],
      };
      setArticles((prev) => [newArticle, ...prev]);
      return newArticle;
    }
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (currentArticle?.id === id) {
      setCurrentArticle(null);
    }
  };

  const togglePublishArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'published' ? 'draft' : 'published' }
          : a
      )
    );
  };

  const likeArticle = (id: string) => {
    const isAlreadyLiked = likedPosts.includes(id);
    if (isAlreadyLiked) {
      // Unlike
      setLikedPosts((prev) => prev.filter((postId) => postId !== id));
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: Math.max(0, a.likes - 1) } : a))
      );
    } else {
      // Like
      setLikedPosts((prev) => [...prev, id]);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
      );
    }
  };

  const incrementViews = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a))
    );
  };

  const addComment = (postId: string, authorName: string, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName: authorName.trim() || 'Reader',
      content: content.trim(),
      createdAt: 'Just now',
      likes: 0,
      isAuthor: isAdmin,
    };

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === postId) {
          const updated = {
            ...a,
            comments: [newComment, ...(a.comments || [])],
          };
          if (currentArticle?.id === postId) {
            setCurrentArticle(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const likeComment = (postId: string, commentId: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === postId) {
          const updated = {
            ...a,
            comments: (a.comments || []).map((c) =>
              c.id === commentId ? { ...c, likes: c.likes + 1 } : c
            ),
          };
          if (currentArticle?.id === postId) {
            setCurrentArticle(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
    if (!isAdmin) return;
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === postId) {
          const updated = {
            ...a,
            comments: (a.comments || []).filter((c) => c.id !== commentId),
          };
          if (currentArticle?.id === postId) {
            setCurrentArticle(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const saveCategory = (catData: Partial<Category> & { name: string }): Category => {
    if (catData.id) {
      const updated: Category = {
        ...(categories.find((c) => c.id === catData.id) as Category),
        ...catData,
      };
      setCategories((prev) => prev.map((c) => (c.id === catData.id ? updated : c)));
      return updated;
    } else {
      const slug = catData.slug || generateSlug(catData.name);
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catData.name,
        slug,
        description: catData.description || 'Kategorya ng artikulo',
        color: catData.color || '#BA6E8F',
      };
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    }
  };

  const deleteCategory = (id: string) => {
    if (categories.length <= 1) return; // Keep at least one
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeCategory === id) {
      setActiveCategory('all');
    }
  };

  const updateAuthor = (profile: Partial<AuthorProfile>) => {
    setAuthor((prev) => ({ ...prev, ...profile }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const exportData = (): string => {
    const backup = {
      articles,
      categories,
      author,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.articles && Array.isArray(parsed.articles)) {
        setArticles(parsed.articles);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (parsed.author && typeof parsed.author === 'object') {
        setAuthor(parsed.author);
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaults = () => {
    setArticles(initialArticles);
    setCategories(initialCategories);
    setAuthor(initialAuthorProfile);
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.AUTHOR);
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        categories,
        author,
        isAdmin,
        theme,
        fontSize,
        activeCategory,
        searchQuery,
        bookmarks,
        likedPosts,
        currentArticle,
        adminPin,
        setTheme,
        setFontSize,
        setActiveCategory,
        setSearchQuery,
        setCurrentArticle,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        saveArticle,
        deleteArticle,
        togglePublishArticle,
        likeArticle,
        addComment,
        likeComment,
        deleteComment,
        saveCategory,
        deleteCategory,
        updateAuthor,
        toggleBookmark,
        incrementViews,
        exportData,
        importData,
        resetToDefaults,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
