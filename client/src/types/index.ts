export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  published: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}
