import React, { useEffect, useState } from 'react';
import { ArticlePost, Category } from '../types';
import { useBlog } from '../context/BlogContext';
import { 
  Eye, 
  FileText, 
  Heading2, 
  Heading3, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Minus, 
  Quote, 
  Save, 
  Sparkles, 
  Upload, 
  X,
  Bold,
  Italic,
  Check
} from 'lucide-react';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit: ArticlePost | null;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  articleToEdit,
}) => {
  const { categories, saveArticle, author } = useBlog();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [kicker, setKicker] = useState('Editorial');
  const [categoryId, setCategoryId] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverCaption, setCoverCaption] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample presets for quick selection
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

  // Initialize or reset form
  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setKicker(articleToEdit.kicker || 'Editorial');
      setCategoryId(articleToEdit.categoryId || categories[0]?.id || '');
      setExcerpt(articleToEdit.excerpt || '');
      setContent(articleToEdit.content || '');
      setCoverImage(articleToEdit.coverImage || '');
      setCoverCaption(articleToEdit.coverCaption || '');
      setTagsInput(articleToEdit.tags?.join(', ') || '');
      setFeatured(articleToEdit.featured || false);
      setStatus(articleToEdit.status || 'published');
    } else {
      setTitle('');
      setKicker('Lead Editorial');
      setCategoryId(categories[0]?.id || '');
      setExcerpt('');
      setContent(`## Opening Reflection

Write the opening thesis of your article here. Introduce your observation or commentary with precision.

> "A compelling editorial does not merely report; it illuminates the moral dimensions of our shared reality."

### Key Arguments & Observations

- First critical observation and supporting evidence
- Cultural context and broader human implications

Conclude with a resonant call to civic mindfulness, urging readers to examine the issue through empathy and reason.`);
      setCoverImage('/src/assets/images/editorial_manila_dusk_1792570804269.jpg');
      setCoverCaption('Evening reflections across the metropolis');
      setTagsInput('Opinion, Editorial, Culture');
      setFeatured(false);
      setStatus('published');
    }
    setActiveTab('editor');
  }, [articleToEdit, isOpen, categories]);

  if (!isOpen) return null;

  // Handle local image upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image file is too large. Maximum size is 8MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCoverImage(result);
    };
    reader.readAsDataURL(file);
  };

  // Helper to insert formatting at cursor or append
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      setContent(prev => prev + '\n' + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text here';
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      setFormError('Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      setFormError('Please enter article content.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    saveArticle({
      id: articleToEdit?.id,
      title: title.trim(),
      kicker: kicker.trim(),
      categoryId: categoryId || categories[0]?.id,
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      coverCaption: coverCaption.trim(),
      tags,
      featured,
      status,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-[#0C0420] border border-[#BA6E8F]/40 shadow-2xl text-stone-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#BA6E8F]/30 bg-[#1b0a24]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#BA6E8F]/25 text-[#F8A5C2] border border-[#F8A5C2]/40 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                {articleToEdit ? 'Edit Editorial Article' : 'Write New Editorial / Post'}
              </h2>
              <span className="text-[11px] text-[#F8A5C2] font-sans font-medium">
                Publish thoughtful commentary and essays under your editorial column
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch between Editor and Live Preview */}
            <div className="flex items-center bg-[#2d1338] rounded-xl p-0.5 border border-[#BA6E8F]/40">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'editor'
                    ? 'bg-[#F8A5C2] text-slate-950 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-[#F8A5C2] text-slate-950 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'editor' ? (
            <form id="post-form" onSubmit={handleSave} className="space-y-6">
              
              {/* Row 1: Kicker & Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                    Kicker / Column Tag
                  </label>
                  <input
                    type="text"
                    value={kicker}
                    onChange={(e) => setKicker(e.target.value)}
                    placeholder="e.g., Lead Editorial, Essay, Commentary"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2]"
                  >
                    <option value="published">Published (Visible to all visitors)</option>
                    <option value="draft">Draft (Visible only to Author)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                  Editorial Headline / Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The City at Twilight: Why We Must Reclaim Public Space for People..."
                  required
                  className="w-full px-4 py-3 text-base sm:text-lg font-serif font-bold bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2]"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                  Excerpt / Lead Deck
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise summary or thought-provoking premise to draw the reader in..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2] resize-none"
                />
              </div>

              {/* Cover Image Selector */}
              <div className="p-4.5 rounded-2xl border border-[#BA6E8F]/30 bg-[#1b0a24]/60 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F8A5C2]">
                    Cover Image (Upload File or Direct Link)
                  </label>
                  
                  {/* Mode switcher */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        imageMode === 'upload' ? 'bg-[#F8A5C2] text-slate-950 font-bold' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        imageMode === 'url' ? 'bg-[#F8A5C2] text-slate-950 font-bold' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3 inline mr-1" />
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('presets')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        imageMode === 'presets' ? 'bg-[#F8A5C2] text-slate-950 font-bold' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Curated Gallery
                    </button>
                  </div>
                </div>

                {/* Upload Mode */}
                {imageMode === 'upload' && (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-[#BA6E8F]/50 hover:border-[#F8A5C2] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#0C0420]/60">
                      <Upload className="w-6 h-6 text-[#F8A5C2] mb-1.5" />
                      <span className="text-xs text-stone-200 font-semibold">
                        Click here to upload an image from your computer
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Supports JPG, PNG, WEBP (up to 8MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadError && (
                      <p className="text-xs text-rose-300 font-medium">{uploadError}</p>
                    )}
                  </div>
                )}

                {/* URL Mode */}
                {imageMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://example.com/editorial-photo.jpg"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0C0420] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2]"
                    />
                  </div>
                )}

                {/* Preset Library Mode */}
                {imageMode === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {curatedPresets.map((preset, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => {
                          setCoverImage(preset.url);
                          setCoverCaption(preset.caption);
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                          coverImage === preset.url
                            ? 'border-[#F8A5C2] ring-2 ring-[#F8A5C2]'
                            : 'border-[#5D3C64]/60 hover:border-[#BA6E8F]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-end p-2">
                          <span className="text-[10px] text-white font-medium line-clamp-1">
                            {preset.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview of current cover image */}
                {coverImage && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-[#BA6E8F]/60 shadow-sm"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={coverCaption}
                        onChange={(e) => setCoverCaption(e.target.value)}
                        placeholder="Image credit or caption (optional)..."
                        className="w-full px-3 py-2 text-xs bg-[#0C0420] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Content Editor with Formatting Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F8A5C2]">
                    Article Content * (Formatted Text & Markdown)
                  </label>
                  <span className="text-[11px] font-mono text-stone-400">
                    {content.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-t-2xl">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs font-bold"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs italic"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-stone-600">|</span>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n## ')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs font-serif font-bold"
                    title="Heading 2 (## Subhead)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n### ')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs font-serif font-bold"
                    title="Heading 3 (### Sub-section)"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-stone-600">|</span>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n> "')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs"
                    title="Blockquote / Sipi (> Quote)"
                  >
                    <Quote className="w-3.5 h-3.5 text-[#F8A5C2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs"
                    title="Bullet List (- Point)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n1. ')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs"
                    title="Numbered List (1. Point)"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n---\n')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 hover:text-white text-xs"
                    title="Horizontal Rule"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  id="post-content-textarea"
                  rows={13}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your essay here with elegance and clarity..."
                  required
                  className="w-full px-4 py-3 text-sm font-body leading-relaxed bg-[#0C0420] border-x border-b border-[#BA6E8F]/40 rounded-b-2xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2] focus:ring-1 focus:ring-[#F8A5C2]"
                />
              </div>

              {/* Tags & Featured Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F8A5C2] mb-1.5">
                    Tags / Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Opinion, Society, Transit, Culture"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#1b0a24] border border-[#BA6E8F]/40 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#F8A5C2]"
                  />
                </div>

                <div className="sm:col-span-4 pt-4 sm:pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-200">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#F8A5C2] focus:ring-[#F8A5C2] border-[#BA6E8F]"
                    />
                    <span>Highlight as Lead Featured Story</span>
                  </label>
                </div>
              </div>

            </form>
          ) : (
            /* Live Preview Tab */
            <div className="max-w-3xl mx-auto py-6">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[#F8A5C2]">
                {kicker} · {categories.find(c => c.id === categoryId)?.name || 'Category'}
              </div>
              <h1 className="font-serif text-3xl font-bold mb-4 text-white">{title || 'Untitled Essay'}</h1>
              {excerpt && <p className="font-serif italic text-lg opacity-90 mb-6 text-[#F8A5C2] border-l-4 border-[#F8A5C2] pl-4">{excerpt}</p>}
              {coverImage && (
                <div className="my-6 rounded-2xl overflow-hidden border border-[#BA6E8F]/40">
                  <img src={coverImage} alt="Cover Preview" className="w-full max-h-80 object-cover" />
                  {coverCaption && <p className="p-3 text-xs italic opacity-80 bg-[#1b0a24] text-stone-300">{coverCaption}</p>}
                </div>
              )}
              <div className="prose text-stone-200 font-body leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4.5 border-t border-[#BA6E8F]/30 bg-[#1b0a24]/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {formError && (
              <span className="text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800 px-3 py-1.5 rounded-lg">
                {formError}
              </span>
            )}
            <button
              type="submit"
              form="post-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F8A5C2] via-[#BA6E8F] to-[#F8A5C2] hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-lg shadow-[#BA6E8F]/25 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'Saving...' : (articleToEdit ? 'Save Article Changes' : 'Publish Editorial Post')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
