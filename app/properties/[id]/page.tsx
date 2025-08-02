import { Metadata } from 'next'
import PropertyDetailClient from './property-detail-client'

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  areaSqft: number
  type: string
  status: string
  featured: boolean
  thumbnailImage: string
  images: Array<{ imageUrl: string }>
  virtualTourLink?: string
  seoTitle?: string
  seoDescription?: string
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/public/advancedSearch/Property`, {
      method: 'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        criteriaList: [{
          key: 'slug',
          value: id,
          operation: 'equals'
        }],
        operations: []
      }),
      next: { revalidate: 1 } // Revalidate every minute
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.data[0] || null
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id)
  
  if (!property) {
    return {
      title: 'Property Not Found | Ananta Realty',
      description: 'The requested property could not be found.',
    }
  }

  // Use SEO fields if available, otherwise fall back to default values
  const title = property.seoTitle || `${property.title} - ${property.location} | Ananta Realty`
  const description = property.seoDescription || 
    `${property.title} in ${property.location}. ${property.bedrooms} bedroom, ${property.bathrooms} bathroom ${property.type} for ${property.price} INR. ${property.description?.substring(0, 150)}...`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: property.images?.length > 0 ? [`/images/${property.images[0].imageUrl}`] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: property.images?.length > 0 ? [`/images/${property.images[0].imageUrl}`] : [],
    },
    alternates: {
      canonical: `/properties/${params.id}`,
    },
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  
  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Property Not Found</h1>
            <a href="/properties" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Properties
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <PropertyDetailClient property={property} />
}
