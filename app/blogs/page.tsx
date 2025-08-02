import { Metadata } from 'next';
import BlogsClient from './blogs-client';

export const metadata: Metadata = {
  title: 'Blog - Real Estate Insights & Tips | Ananta Realty',
  description: 'Discover the latest real estate insights, market trends, investment tips, and property guides from Ananta Realty experts.',
  openGraph: {
    title: 'Blog - Real Estate Insights & Tips | Ananta Realty',
    description: 'Discover the latest real estate insights, market trends, investment tips, and property guides from Ananta Realty experts.',
    type: 'website',
  },
};

async function getBlogs(page: number = 1, size: number = 12) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/public/advancedSearch/Blog?page=${page}&size=${size}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          criteriaList: [{
          key: "status",
          operation: "equals",
          value: 'published',
        }],
      operations:[]}),
        next: { revalidate: 1 }, // Cache for 5 minutes
      }
    );
    
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const blogsData = await getBlogs(page, 12);
  console.log(blogsData);
  return <BlogsClient blogsData={blogsData} currentPage={page} />;
} 