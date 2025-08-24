import { Metadata } from 'next';
import BlogDetailClient from './blog-detail-client';
import { Blog } from '@/lib/interfaces';

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/public/blogs/${slug}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Ananta Realty',
      description: 'The requested blog post could not be found.',
    };
  }

  // Use SEO fields if available, otherwise fall back to default values
  const title = blog.metaTitle || `${blog.title} | Ananta Realty Blog`;
  const description = blog.metaDescription || 
    (blog.excerpt || blog.content.substring(0, 160) + '...');

  const imageUrl = blog.featuredImage || blog.thumbnailImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: imageUrl ? [imageUrl] : [],
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author ? [blog.author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `/blogs/${params.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Blog Not Found</h1>
            <a href="/blogs" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Blogs
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <BlogDetailClient blog={blog} />;
} 