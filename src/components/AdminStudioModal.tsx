import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { ArticlePost, Category } from '../types';
import { 
  BarChart3,
  BookOpen,
  Check, 
  Clock,
  Database,
  Download, 
  Edit, 
  Eye, 
  FileText, 
  FolderPlus, 
  Heart, 
  Home,
  KeyRound, 
  LayoutGrid, 
  Lock, 
  LogOut, 
  MessageSquare, 
  Plus, 
  RefreshCcw, 
  Save, 
  Search, 
  Sparkles, 
  Tag, 
  Trash2, 
  Upload, 
  User, 
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  ArrowRight,
  PenTool,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  AlertTriangle
} from 'lucide-react';

interface AdminStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewPost: () => void;
  onEditArticle: (article: ArticlePost) => void;
}

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenNewPost,
  onEditArticle,
}) => {
  const { 
    articles, 
    categories, 
    author, 
    adminPin,
    logoutAdmin,
    saveCategory, 
    deleteCategory, 
    deleteArticle, 
    togglePublishArticle, 
    updateAuthor, 
    updateAdminPin, 
    exportData, 
    importData, 
    resetToDefaults,
    deleteComment,
    saveArticle
  } = useBlog();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'write' | 'posts' | 'categories' | 'profile' | 'comments' | 'security' | 'backup'>('dashboard');
  const [postSearch, setPostSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // =========================================================================
  // INTEGRATED POST EDITOR STATE (Directly built into the Admin workspace)
  // =========================================================================
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleKicker, setArticleKicker] = useState('Lead Editorial');
  const [articleCategoryId, setArticleCategoryId] = useState(categories[0]?.id || '');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCover, setArticleCover] = useState('/src/assets/images/editorial_manila_dusk_1792570804269.jpg');
  const [articleCaption, setArticleCaption] = useState('Evening contemplation on modern culture');
  const [articleCoverMode, setArticleCoverMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [articleTags, setArticleTags] = useState('Editorial, Culture, Society');
  const [articleFeatured, setArticleFeatured] = useState(false);
  const [articleStatus, setArticleStatus] = useState<'published' | 'draft'>('published');
  const [editorViewMode, setEditorViewMode] = useState<'editor' | 'preview'>('editor');
  const [articleSavedToast, setArticleSavedToast] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState('');
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [articleValidationError, setArticleValidationError] = useState('');
  const [articleToDelete, setArticleToDelete] = useState<ArticlePost | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [adminToast, setAdminToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => {
      setAdminToast((curr) => (curr?.message === message ? null : curr));
    }, 2800);
  };

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#BA6E8F');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Author form state
  const [authorName, setAuthorName] = useState(author.name);
  const [authorTitle, setAuthorTitle] = useState(author.title);
  const [authorColumnName, setAuthorColumnName] = useState(author.columnName);
  const [authorBio, setAuthorBio] = useState(author.bio);
  const [authorAvatar, setAuthorAvatar] = useState(author.avatar);
  const [authorMotto, setAuthorMotto] = useState(author.motto);
  const [authorEmail, setAuthorEmail] = useState(author.email);
  const [authorLocation, setAuthorLocation] = useState(author.location);
  const [authorSavedToast, setAuthorSavedToast] = useState(false);

  // Security pin state
  const [newPin, setNewPin] = useState('');
  const [pinToast, setPinToast] = useState(false);

  // Backup state
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // User palette colors
  const paletteSwatches = [
    { name: 'Rose Accent', hex: '#BA6E8F' },
    { name: 'Dusty Rose', hex: '#D391B0' },
    { name: 'Blush Pink', hex: '#F8A5C2' },
    { name: 'Orchid Mauve', hex: '#9F6496' },
    { name: 'Antique Mauve', hex: '#7B466A' },
    { name: 'Dusky Plum', hex: '#5D3C64' },
    { name: 'Obsidian Midnight', hex: '#0C0420' },
  ];

  // Curated cover presets
  const curatedPresets = [
    {
      name: 'City at Twilight',
      url: '/src/assets/images/editorial_manila_dusk_1792570804269.jpg',
      caption: 'Twilight settling across the urban skyline',
    },
    {
      name: 'Fountain Pen & Journal',
      url: '/src/assets/images/editorial_pen_notebook_1792570804853.jpg',
      caption: 'Fountain pen, warm dark coffee, and space for contemplation',
    },
    {
      name: 'Author Portrait (Aby)',
      url: '/src/assets/images/author_ruby_aby_portrait_1792571832285.jpg',
      caption: 'Ruby Aumentado Orozco (aby) — Columnist & Author',
    },
    {
      name: 'Modernity & Abstract',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      caption: 'Luminous abstract intersection of form and consciousness',
    },
  ];

  if (!isOpen) return null;

  // Aggregate stats
  const totalLikes = articles.reduce((acc, curr) => acc + curr.likes, 0);
  const totalViews = articles.reduce((acc, curr) => acc + curr.views, 0);
  const totalComments = articles.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);

  // Filtered posts for manager
  const filteredPosts = articles.filter(art => {
    const matchesCat = categoryFilter === 'all' || art.categoryId === categoryFilter;
    const matchesSearch = !postSearch.trim() || 
      art.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      art.kicker?.toLowerCase().includes(postSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Collect all comments across all articles
  const allComments = articles.flatMap(art => 
    (art.comments || []).map(c => ({
      ...c,
      articleTitle: art.title,
      articleId: art.id
    }))
  );

  // Start writing a fresh post inside admin
  const handleStartNewArticle = () => {
    setEditingArticleId(null);
    setArticleTitle('');
    setArticleKicker('Editorial');
    setArticleCategoryId(categories[0]?.id || '');
    setArticleExcerpt('');
    setArticleContent(`## Opening Reflection

Write the opening thesis of your article here. Introduce your observation or commentary with precision.

> "A compelling editorial does not merely report; it illuminates the moral dimensions of our shared reality."

### Key Arguments & Observations

- First critical observation and supporting evidence
- Cultural context and broader human implications

Conclude with a resonant call to civic mindfulness, urging readers to examine the issue through empathy and reason.`);
    setArticleCover('/src/assets/images/editorial_manila_dusk_1792570804269.jpg');
    setArticleCaption('Reflections on society and culture');
    setArticleTags('Editorial, Opinion, Society');
    setArticleFeatured(false);
    setArticleStatus('published');
    setEditorViewMode('editor');
    setActiveTab('write');
  };

  // Start editing an existing post inside admin
  const handleStartEditArticle = (art: ArticlePost) => {
    setEditingArticleId(art.id);
    setArticleTitle(art.title);
    setArticleKicker(art.kicker || 'Editorial');
    setArticleCategoryId(art.categoryId || categories[0]?.id || '');
    setArticleExcerpt(art.excerpt || '');
    setArticleContent(art.content || '');
    setArticleCover(art.coverImage || '/src/assets/images/editorial_pen_notebook_1792570804853.jpg');
    setArticleCaption(art.coverCaption || '');
    setArticleTags(art.tags?.join(', ') || '');
    setArticleFeatured(Boolean(art.featured));
    setArticleStatus(art.status || 'published');
    setEditorViewMode('editor');
    setActiveTab('write');
  };

  // Handle local post cover file upload
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCoverUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setCoverUploadError('Image size is too large (maximum 8MB).');
      return;
    }

    setCoverUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setArticleCover(result);
    };
    reader.readAsDataURL(file);
  };

  // Insert markdown tag in inline editor
  const insertMarkdownTag = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('admin-inline-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      setArticleContent(prev => prev + '\n' + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = articleContent.substring(start, end) || 'text here';
    const rep = prefix + selected + suffix;

    const updated = articleContent.substring(0, start) + rep + articleContent.substring(end);
    setArticleContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Save the article from the inline editor with double-click prevention
  const handleSaveArticleInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingArticle) return; // Prevent duplicate clicks!

    if (!articleTitle.trim()) {
      setArticleValidationError('Please provide a headline/title for your article.');
      return;
    }
    if (!articleContent.trim()) {
      setArticleValidationError('Please enter some content for your article.');
      return;
    }

    setArticleValidationError('');
    setIsSavingArticle(true);

    const tags = articleTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    saveArticle({
      id: editingArticleId || undefined,
      title: articleTitle.trim(),
      kicker: articleKicker.trim() || 'Editorial',
      categoryId: articleCategoryId || categories[0]?.id,
      excerpt: articleExcerpt.trim(),
      content: articleContent.trim(),
      coverImage: articleCover.trim(),
      coverCaption: articleCaption.trim(),
      tags,
      featured: articleFeatured,
      status: articleStatus,
    });

    const isEditing = Boolean(editingArticleId);
    showToast(isEditing ? 'Article updated successfully!' : 'Article published successfully!');
    
    setIsSavingArticle(false);
    setActiveTab('posts');
  };

  // Instant Delete Handlers (No window.confirm!)
  const handleConfirmDeleteArticle = () => {
    if (!articleToDelete) return;
    const deletedTitle = articleToDelete.title;
    deleteArticle(articleToDelete.id);
    setArticleToDelete(null);
    showToast(`"${deletedTitle}" was deleted successfully.`, 'info');
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const catName = categoryToDelete.name;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
    showToast(`Category "${catName}" was removed.`, 'info');
  };

  // Handle Author Photo Upload
  const handleAuthorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAuthorAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    saveCategory({
      id: editingCatId || undefined,
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      color: newCatColor,
    });

    setNewCatName('');
    setNewCatDesc('');
    setEditingCatId(null);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setNewCatDesc(cat.description);
    setNewCatColor(cat.color);
  };

  // Save Author Profile
  const handleSaveAuthorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAuthor({
      name: authorName,
      title: authorTitle,
      columnName: authorColumnName,
      bio: authorBio,
      avatar: authorAvatar,
      motto: authorMotto,
      email: authorEmail,
      location: authorLocation,
    });
    setAuthorSavedToast(true);
    setTimeout(() => setAuthorSavedToast(false), 2500);
  };

  // Save Admin PIN
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      updateAdminPin(newPin.trim());
      setPinToast(true);
      setNewPin('');
      setTimeout(() => setPinToast(false), 2500);
    }
  };

  // Export JSON
  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pananaw_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = () => {
    if (!importJson.trim()) return;
    const ok = importData(importJson);
    if (ok) {
      setImportStatus('Backup restored successfully!');
      setImportJson('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Invalid JSON file format. Please check the backup file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#FFF5F8] overflow-hidden antialiased">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Dark Obsidian Plum `#0C0420` with script logo and pink tab) */}
      {/* ========================================================================= */}
      <aside className="w-64 lg:w-72 bg-[#0C0420] text-stone-200 flex flex-col justify-between shrink-0 select-none border-r border-[#5D3C64]/30 shadow-2xl z-20">
        
        {/* Brand Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-7">
            <span className="font-['Caveat',cursive] text-3xl font-bold text-[#F8A5C2] tracking-wide">
              Pananaw
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300 font-sans px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 ml-1">
              ADMIN
            </span>
          </div>

          {/* Quick Write Post Action in Sidebar */}
          <div className="mb-4">
            <button
              onClick={handleStartNewArticle}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                activeTab === 'write' && !editingArticleId
                  ? 'bg-white text-slate-950 ring-2 ring-[#F8A5C2]'
                  : 'bg-gradient-to-r from-[#F8A5C2] via-[#BA6E8F] to-[#F8A5C2] text-slate-950 hover:opacity-95'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-slate-950" />
              <span>Write New Post</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-sans">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
              <span>Dashboard</span>
            </button>

            {/* All Articles */}
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'posts'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <FileText className={`w-4 h-4 ${activeTab === 'posts' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
                <span>All Articles</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'posts' ? 'bg-black/15 text-slate-950 font-bold' : 'bg-white/10 text-stone-300'
              }`}>
                {articles.length}
              </span>
            </button>

            {/* Categories */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Tag className={`w-4 h-4 ${activeTab === 'categories' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
                <span>Categories</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'categories' ? 'bg-black/15 text-slate-950 font-bold' : 'bg-white/10 text-stone-300'
              }`}>
                {categories.length}
              </span>
            </button>

            {/* Author Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
              <span>Author Profile</span>
            </button>

            {/* Reader Comments */}
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'comments'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare className={`w-4 h-4 ${activeTab === 'comments' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
                <span>Reader Comments</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'comments' ? 'bg-black/15 text-slate-950 font-bold' : 'bg-white/10 text-stone-300'
              }`}>
                {totalComments}
              </span>
            </button>

            {/* Security & PIN */}
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className={`w-4 h-4 ${activeTab === 'security' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
              <span>Security & Passcode</span>
            </button>

            {/* Backup & Data */}
            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-[#F8A5C2] text-slate-950 shadow-md shadow-[#F8A5C2]/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className={`w-4 h-4 ${activeTab === 'backup' ? 'text-slate-950' : 'text-[#F8A5C2]'}`} />
              <span>Backup & Data</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: View Site & Logout */}
        <div className="p-6 border-t border-white/10 space-y-2">
          {/* View site link */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4 text-[#F8A5C2]" />
            <span>View Public Blog</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logoutAdmin();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F8A5C2] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* RIGHT MAIN WORKSPACE (Soft warm blush canvas `#FFF5F8` with pink styling)  */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#FFF5F8] text-slate-800">
        
        {/* Top Floating Strip */}
        <div className="px-8 pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#BA6E8F]" />
            <span className="text-xs font-bold text-[#BA6E8F] uppercase tracking-wider">
              Author Studio
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-bold text-slate-700">
              {activeTab === 'write'
                ? editingArticleId ? 'Edit Article' : 'Article Composer'
                : activeTab === 'posts'
                ? 'All Articles'
                : activeTab === 'categories'
                ? 'Categories'
                : activeTab === 'profile'
                ? 'Author Profile'
                : activeTab === 'comments'
                ? 'Comments'
                : activeTab === 'security'
                ? 'Security & Passcode'
                : activeTab === 'backup'
                ? 'Backup & Data'
                : 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View live site button */}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 border border-pink-200 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              title="Return to the live public reader website"
            >
              <Eye className="w-4 h-4 text-[#BA6E8F]" />
              <span>View Public Blog</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content View */}
        <div className="px-8 pb-12 flex-1">
          
          {/* ===================================================================== */}
          {/* TAB: WRITE / EDIT ARTICLE (Integrated directly into admin workspace)   */}
          {/* ===================================================================== */}
          {activeTab === 'write' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => setActiveTab('posts')}
                      className="text-xs font-bold text-[#BA6E8F] hover:underline flex items-center gap-1"
                    >
                      <span>← Back to Articles</span>
                    </button>
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-slate-900">
                    {editingArticleId ? 'Edit Editorial Article' : 'Write New Editorial Article'}
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Compose articles, add cover images from your computer or web links, format headings and quotes.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View mode toggle */}
                  <div className="flex items-center bg-white rounded-xl p-0.5 border border-pink-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setEditorViewMode('editor')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        editorViewMode === 'editor' ? 'bg-[#F8A5C2] text-slate-950 shadow-xs' : 'text-stone-600 hover:text-slate-900'
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorViewMode('preview')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        editorViewMode === 'preview' ? 'bg-[#F8A5C2] text-slate-950 shadow-xs' : 'text-stone-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    form="admin-article-form"
                    disabled={isSavingArticle}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F8A5C2] via-[#BA6E8F] to-[#F8A5C2] hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-slate-950" />
                    <span>{isSavingArticle ? 'Saving...' : (editingArticleId ? 'Save Changes' : 'Publish Article')}</span>
                  </button>
                </div>
              </div>

              {articleValidationError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{articleValidationError}</span>
                </div>
              )}

              {editorViewMode === 'editor' ? (
                <form id="admin-article-form" onSubmit={handleSaveArticleInline} className="space-y-6">
                  
                  {/* Row 1: Kicker & Category & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Kicker / Column Tag
                      </label>
                      <input
                        type="text"
                        value={articleKicker}
                        onChange={(e) => setArticleKicker(e.target.value)}
                        placeholder="e.g., Lead Editorial, Essay, Cultural Commentary"
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={articleCategoryId}
                        onChange={(e) => setArticleCategoryId(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Publication Status
                      </label>
                      <select
                        value={articleStatus}
                        onChange={(e) => setArticleStatus(e.target.value as 'published' | 'draft')}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      >
                        <option value="published">Published (Visible on site)</option>
                        <option value="draft">Draft (Private to author)</option>
                      </select>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Editorial Headline / Title *
                      </label>
                      <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g., The City at Twilight: Why Public Space Belongs to People..."
                        required
                        className="w-full px-4 py-3 text-lg sm:text-xl font-serif font-bold bg-stone-50 border border-stone-200 rounded-xl text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Excerpt / Lead-in Deck
                      </label>
                      <textarea
                        rows={2}
                        value={articleExcerpt}
                        onChange={(e) => setArticleExcerpt(e.target.value)}
                        placeholder="An engaging summary or provocative premise that invites the reader in..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2] resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Cover Image Selector */}
                  <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Cover Image (Upload File or Enter Web Link)
                      </label>

                      <div className="flex items-center gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setArticleCoverMode('upload')}
                          className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                            articleCoverMode === 'upload' ? 'bg-[#F8A5C2] text-slate-950' : 'text-stone-600 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleCoverMode('url')}
                          className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                            articleCoverMode === 'url' ? 'bg-[#F8A5C2] text-slate-950' : 'text-stone-600 hover:text-slate-950'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                          Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setArticleCoverMode('presets')}
                          className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                            articleCoverMode === 'presets' ? 'bg-[#F8A5C2] text-slate-950' : 'text-stone-600 hover:text-slate-950'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                          Curated Gallery
                        </button>
                      </div>
                    </div>

                    {/* Upload File */}
                    {articleCoverMode === 'upload' && (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-pink-200 hover:border-[#F8A5C2] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-pink-50/20">
                          <Upload className="w-8 h-8 text-[#BA6E8F] mb-1.5" />
                          <span className="text-xs font-bold text-slate-800">
                            Click here to select an image from your computer
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Supports JPG, PNG, WEBP (up to 8MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFileUpload}
                            className="hidden"
                          />
                        </label>
                        {coverUploadError && (
                          <p className="text-xs text-rose-500 font-semibold">{coverUploadError}</p>
                        )}
                      </div>
                    )}

                    {/* URL Input */}
                    {articleCoverMode === 'url' && (
                      <div>
                        <input
                          type="url"
                          value={articleCover}
                          onChange={(e) => setArticleCover(e.target.value)}
                          placeholder="https://example.com/editorial-photo.jpg"
                          className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                        />
                      </div>
                    )}

                    {/* Curated Presets */}
                    {articleCoverMode === 'presets' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {curatedPresets.map((preset, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => {
                              setArticleCover(preset.url);
                              setArticleCaption(preset.caption);
                            }}
                            className={`group relative rounded-2xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                              articleCover === preset.url
                                ? 'border-[#F8A5C2] ring-2 ring-[#F8A5C2] shadow-md'
                                : 'border-stone-200 hover:border-pink-300'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] text-white font-medium line-clamp-1">
                                {preset.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Thumbnail Preview & Caption */}
                    {articleCover && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                        <img
                          src={articleCover}
                          alt="Cover preview"
                          className="w-24 h-16 object-cover rounded-xl border border-pink-200 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/editorial_pen_notebook_1792570804853.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={articleCaption}
                            onChange={(e) => setArticleCaption(e.target.value)}
                            placeholder="Image caption or photographer credit (optional)..."
                            className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Editor with Formatting Bar */}
                  <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-pink-100 bg-pink-50/40 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('**', '**')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs font-bold"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('*', '*')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs italic"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-stone-300">|</span>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n## ')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs font-serif font-bold"
                          title="Heading 2 (## Subhead)"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n### ')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs font-serif font-bold"
                          title="Heading 3 (### Sub-section)"
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-stone-300">|</span>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n> "')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs"
                          title="Blockquote (> Quote)"
                        >
                          <Quote className="w-3.5 h-3.5 text-[#BA6E8F]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n- ')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs"
                          title="Bullet List (- Point)"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n1. ')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs"
                          title="Numbered List (1. Point)"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownTag('\n---\n')}
                          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-stone-50 text-slate-900 text-xs"
                          title="Divider"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-stone-500 font-semibold">
                        {articleContent.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(articleContent.trim().split(/\s+/).filter(Boolean).length / 180))} min read
                      </div>
                    </div>

                    <textarea
                      id="admin-inline-editor-textarea"
                      rows={14}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      placeholder="Write your insightful essay or editorial commentary here..."
                      required
                      className="w-full p-6 text-sm font-body leading-relaxed bg-white text-slate-900 focus:outline-none resize-y"
                    />
                  </div>

                  {/* Tags & Featured Checkbox */}
                  <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Tags / Topics (separated by commas)
                      </label>
                      <input
                        type="text"
                        value={articleTags}
                        onChange={(e) => setArticleTags(e.target.value)}
                        placeholder="e.g., Editorial, Urbanism, Philosophy, Literature"
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div className="sm:col-span-4 pt-4 sm:pt-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={articleFeatured}
                          onChange={(e) => setArticleFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-[#BA6E8F] focus:ring-[#F8A5C2] border-stone-300"
                        />
                        <span>Highlight as Lead Featured Story</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('posts')}
                      className="px-5 py-2.5 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      Discard / Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingArticle}
                      className="px-7 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F8A5C2] via-[#BA6E8F] to-[#F8A5C2] hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-lg shadow-[#F8A5C2]/30 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>{isSavingArticle ? 'Publishing Post...' : (editingArticleId ? 'Save Article Changes' : 'Publish Editorial Post')}</span>
                    </button>
                  </div>

                </form>
              ) : (
                /* Live Preview Container */
                <div className="bg-white p-8 sm:p-12 rounded-3xl border border-pink-100 shadow-sm max-w-4xl mx-auto space-y-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#BA6E8F]">
                    {articleKicker} · {categories.find(c => c.id === articleCategoryId)?.name || 'Editorial'}
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                    {articleTitle || 'Untitled Editorial'}
                  </h1>
                  {articleExcerpt && (
                    <p className="font-serif italic text-lg text-[#BA6E8F] border-l-4 border-[#F8A5C2] pl-4 leading-relaxed">
                      {articleExcerpt}
                    </p>
                  )}
                  {articleCover && (
                    <div className="rounded-2xl overflow-hidden border border-pink-200">
                      <img src={articleCover} alt="Cover Preview" className="w-full max-h-96 object-cover" />
                      {articleCaption && (
                        <p className="p-3 text-xs italic bg-stone-50 text-stone-600">
                          {articleCaption}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="prose text-slate-800 font-body leading-relaxed whitespace-pre-wrap">
                    {articleContent}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW (Exactly inspired by image_fe2865a3.png)     */}
          {/* ===================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              
              {/* Header Title & Subtitle */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-1.5">
                  Dashboard
                </h1>
                <p className="text-sm text-stone-600 font-sans">
                  Welcome back, {author.name}! Here is an overview of your editorial publication.
                </p>
              </div>

              {/* 4 Metric Cards in horizontal row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Metric 1: Total Articles */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Total Articles
                    </span>
                    <span className="font-serif text-3xl font-bold text-slate-900">
                      {articles.length}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 2: Active Categories */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Active Categories
                    </span>
                    <span className="font-serif text-3xl font-bold text-slate-900">
                      {categories.length}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-xs">
                    <Tag className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 3: Total Hearts / Appreciation */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Reader Hearts
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#BA6E8F]">
                      {totalLikes}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-[#F8A5C2] shadow-xs">
                    <Heart className="w-6 h-6 fill-[#F8A5C2]" />
                  </div>
                </div>

                {/* Metric 4: Total Reader Views */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Total Reads
                    </span>
                    <span className="font-serif text-3xl font-bold text-slate-900">
                      {totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-xs">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Lower Section: Recent Performance & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Recent Articles List / Table preview */}
                <div className="lg:col-span-8 bg-white p-7 rounded-3xl border border-pink-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#BA6E8F]" />
                      <span>Published Essays & Editorials</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('posts')}
                      className="text-xs font-bold text-[#BA6E8F] hover:underline"
                    >
                      Manage All ({articles.length}) &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {articles.slice(0, 4).map((art) => (
                      <div key={art.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[11px] text-[#BA6E8F] mb-1 font-semibold">
                            <span>{art.categoryName}</span>
                            <span aria-hidden="true" className="text-stone-300">·</span>
                            <span className="text-stone-500 font-normal">{art.publishedAt}</span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-slate-900 truncate">
                            {art.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            art.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {art.status === 'published' ? 'Published' : 'Draft'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditArticle(art)}
                              className="p-1.5 text-stone-500 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit article"
                            >
                              <Edit className="w-4 h-4 text-[#BA6E8F]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Quick Actions Card */}
                <div className="lg:col-span-4 bg-white p-7 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleStartNewArticle}
                      className="w-full py-3.5 px-4 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-2xl shadow-sm transition-all flex items-center justify-between"
                    >
                      <span>Write New Article</span>
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('categories')}
                      className="w-full py-3.5 px-4 text-xs font-bold text-slate-800 bg-pink-50/80 hover:bg-pink-100/80 rounded-2xl transition-colors flex items-center justify-between"
                    >
                      <span>Manage Categories</span>
                      <Tag className="w-4 h-4 text-[#BA6E8F]" />
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#0C0420] hover:bg-[#1b0a24] rounded-2xl shadow-sm transition-colors flex items-center justify-between"
                    >
                      <span>Edit Author Profile</span>
                      <User className="w-4 h-4 text-[#F8A5C2]" />
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full py-3 px-4 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl transition-colors flex items-center justify-between"
                    >
                      <span>Return to Public Site</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ALL ARTICLES / POSTS MANAGER                                   */}
          {/* ===================================================================== */}
          {activeTab === 'posts' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-slate-900">
                    All Articles ({articles.length})
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Manage drafts, published editorial pieces, views, and interactions.
                  </p>
                </div>

                <button
                  onClick={handleStartNewArticle}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-md transition-all flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Article</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles by title or keyword..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Posts Table */}
              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 bg-pink-50/40 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-4 px-6">Headline & Deck</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Published Date</th>
                        <th className="py-4 px-4 text-center">Engagement</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredPosts.map((art) => (
                        <tr key={art.id} className="hover:bg-pink-50/30 transition-colors">
                          <td className="py-4 px-6 max-w-xs sm:max-w-md">
                            <span className="text-[10px] font-bold text-[#BA6E8F] uppercase tracking-wider block mb-0.5">
                              {art.kicker}
                            </span>
                            <span className="font-serif font-bold text-sm text-slate-900 block truncate">
                              {art.title}
                            </span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
                              {art.categoryName}
                            </span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-stone-500">
                            {art.publishedAt}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center gap-3 text-stone-500 font-mono">
                              <span className="flex items-center gap-1" title="Hearts">
                                <Heart className="w-3.5 h-3.5 text-[#F8A5C2] fill-[#F8A5C2]" />
                                {art.likes}
                              </span>
                              <span className="flex items-center gap-1" title="Comments">
                                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                                {art.comments?.length || 0}
                              </span>
                              <span className="flex items-center gap-1" title="Reads">
                                <Eye className="w-3.5 h-3.5 text-stone-400" />
                                {art.views}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => togglePublishArticle(art.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                art.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {art.status === 'published' ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEditArticle(art)}
                                className="p-2 text-stone-600 hover:text-slate-900 hover:bg-stone-100 rounded-xl transition-colors"
                                title="Edit post directly"
                              >
                                <Edit className="w-4 h-4 text-[#BA6E8F]" />
                              </button>
                              <button
                                onClick={() => setArticleToDelete(art)}
                                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: CATEGORIES MANAGER                                             */}
          {/* ===================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                  Categories Manager
                </h1>
                <p className="text-xs text-stone-600 mt-1">
                  Create and organize topical tags using the official brand color palette.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form to Add / Edit Category */}
                <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-pink-100 shadow-sm space-y-5">
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    {editingCatId ? 'Edit Category' : 'Add New Category'}
                  </h3>

                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Feminine Thought, Politics, Arts"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="A short description of articles found under this category..."
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                        Branding Swatch Color
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {paletteSwatches.map((color) => (
                          <button
                            type="button"
                            key={color.hex}
                            onClick={() => setNewCatColor(color.hex)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${
                              newCatColor === color.hex ? 'scale-110 border-slate-900 shadow-md ring-2 ring-pink-300' : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingCatId ? 'Save Category' : 'Create Category'}</span>
                      </button>

                      {editingCatId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(null);
                            setNewCatName('');
                            setNewCatDesc('');
                          }}
                          className="px-4 py-3 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Categories Cards List */}
                <div className="lg:col-span-7 space-y-3">
                  {categories.map((cat) => {
                    const postCount = articles.filter(a => a.categoryId === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: cat.color }}
                          />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-slate-900">
                              {cat.name}
                            </h4>
                            <p className="text-xs text-stone-500 font-sans line-clamp-1">
                              {cat.description || 'No description provided'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono font-bold text-[#BA6E8F] bg-pink-50 px-2.5 py-1 rounded-full">
                            {postCount} posts
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="p-1.5 text-stone-500 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <Edit className="w-4 h-4 text-[#BA6E8F]" />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: AUTHOR PROFILE (Ruby Aumentado Orozco (aby))                   */}
          {/* ===================================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                  Author Profile Settings
                </h1>
                <p className="text-xs text-stone-600 mt-1">
                  Customize the author portrait, biographical statement, column name, and editorial quote.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm max-w-4xl space-y-6">
                
                {/* Author Photo Preview & Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100">
                  <div className="relative group">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="w-28 h-28 rounded-3xl object-cover ring-4 ring-[#F8A5C2] shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/author_ruby_aby_portrait_1792571832285.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      Author Portrait Photo
                    </h3>
                    <p className="text-xs text-stone-500">
                      Upload a new photo from your device or paste an image URL.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <label className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAuthorPhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste image URL..."
                        value={authorAvatar}
                        onChange={(e) => setAuthorAvatar(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 w-64 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveAuthorProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Author Full Name *
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Column Name *
                      </label>
                      <input
                        type="text"
                        value={authorColumnName}
                        onChange={(e) => setAuthorColumnName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={authorTitle}
                        onChange={(e) => setAuthorTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={authorLocation}
                        onChange={(e) => setAuthorLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Biographical Statement
                    </label>
                    <textarea
                      rows={3}
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Editorial Motto / Philosophical Quote
                    </label>
                    <textarea
                      rows={2}
                      value={authorMotto}
                      onChange={(e) => setAuthorMotto(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2] italic"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-6 py-3 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>Save Profile Changes</span>
                    </button>

                    {authorSavedToast && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Profile updated successfully!</span>
                      </span>
                    )}
                  </div>
                </form>

              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: READER COMMENTS MANAGER                                        */}
          {/* ===================================================================== */}
          {activeTab === 'comments' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                  Reader Comments & Reflections ({allComments.length})
                </h1>
                <p className="text-xs text-stone-600 mt-1">
                  Read, moderate, and manage comments submitted by visitors across all your essays.
                </p>
              </div>

              <div className="space-y-3">
                {allComments.length > 0 ? (
                  allComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900">{comment.authorName}</span>
                          <span className="text-stone-400">·</span>
                          <span className="text-stone-500">{comment.createdAt}</span>
                          <span className="text-stone-400">·</span>
                          <span className="font-semibold text-[#BA6E8F]">
                            on "{comment.articleTitle}"
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 font-body leading-relaxed">
                          "{comment.content}"
                        </p>
                        <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                          <Heart className="w-3.5 h-3.5 text-[#F8A5C2] fill-[#F8A5C2]" />
                          <span>{comment.likes} reader likes</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteComment(comment.articleId, comment.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-pink-100 text-center text-stone-500">
                    <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">No reader comments yet</p>
                    <p className="text-xs text-stone-500 mt-1">Comments submitted on your published articles will appear here.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: SECURITY & PASSCODE                                            */}
          {/* ===================================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                  Security & Admin PIN
                </h1>
                <p className="text-xs text-stone-600 mt-1">
                  Change the passcode used to access this administrative portal.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm max-w-lg space-y-5">
                <form onSubmit={handleSavePin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Current Passcode
                    </label>
                    <div className="font-mono text-xs bg-stone-100 border border-stone-200 px-3.5 py-2.5 rounded-xl text-slate-800">
                      {adminPin}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      New Passcode (at least 4 characters)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new PIN or passcode..."
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      required
                      minLength={4}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={newPin.length < 4}
                      className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] disabled:opacity-50 rounded-xl shadow-md transition-all"
                    >
                      Update Passcode
                    </button>

                    {pinToast && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Passcode updated!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 7: BACKUP & DATA                                                  */}
          {/* ===================================================================== */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-900">
                  Data Backup & Restore
                </h1>
                <p className="text-xs text-stone-600 mt-1">
                  Export all your written articles, comments, and categories, or restore from a JSON backup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export Card */}
                <div className="bg-white p-7 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#BA6E8F]" />
                    <span>Download JSON Backup</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Saves all your essays, categories, visitor comments, and configuration into a local file for safekeeping.
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#F8A5C2] hover:bg-[#f59ebc] rounded-xl shadow-sm transition-all"
                  >
                    Download Backup File
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white p-7 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#BA6E8F]" />
                    <span>Restore from Backup</span>
                  </h3>
                  <textarea
                    rows={3}
                    placeholder="Paste backup JSON string here..."
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#F8A5C2]"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleImportJson}
                      disabled={!importJson.trim()}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black disabled:opacity-50 rounded-xl shadow-sm transition-all"
                    >
                      Restore Data
                    </button>
                    {importStatus && (
                      <span className="text-xs font-semibold text-emerald-600">
                        {importStatus}
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* DELETE ARTICLE CONFIRMATION MODAL (In-App, Instant, No window.confirm!)  */}
      {/* ========================================================================= */}
      {articleToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-pink-100 text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Delete Article?
                </h3>
                <span className="text-xs text-rose-600 font-semibold">
                  This action is permanent
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{articleToDelete.title}"</span>? This will immediately remove it from your published editorials.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteArticle}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CATEGORY CONFIRMATION MODAL (In-App, Instant, No window.confirm!) */}
      {/* ========================================================================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-pink-100 text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Delete Category?
                </h3>
                <span className="text-xs text-stone-500 font-sans">
                  Articles under this tag will remain safe
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Are you sure you want to delete category <span className="font-bold text-slate-900">"{categoryToDelete.name}"</span>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSTANT FLOATING NOTIFICATION TOAST                                       */}
      {/* ========================================================================= */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-[110] bg-[#0C0420] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F8A5C2]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-[#F8A5C2]/20 text-[#F8A5C2] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-stone-100">{adminToast.message}</span>
        </div>
      )}

    </div>
  );
};
