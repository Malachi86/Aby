export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  isAuthor?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // Hex code from palette or Tailwind color
}

export interface ArticlePost {
  id: string;
  title: string;
  kicker: string; // e.g. "Opinyon", "Editoryal", "Sanaysay", "Kritika", "Pagninilay"
  slug: string;
  excerpt: string;
  content: string; // Rich article text (paragraphs, headers, quotes, lists)
  coverImage: string;
  coverCaption?: string;
  categoryId: string;
  categoryName: string;
  publishedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  likes: number;
  views: number;
  status: 'published' | 'draft';
  tags: string[];
  comments: Comment[];
}

export interface AuthorProfile {
  name: string;
  title: string;
  columnName: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  socials: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    substack?: string;
  };
  motto: string;
}

export type ReaderTheme = 'dark' | 'sepia' | 'light';
export type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';
