export interface PropertyImage {
  id: string
  imageUrl: string
  altText: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  areaSqft: string
  location: string
  images: PropertyImage[]
  thumbnailImage: string
  type: string
  featured: boolean
  sold: boolean
  latitude: number
  longitude: number
  pinCode: number
  status: string
  seoTitle: string
  seoDescription: string
  virtualTourLink: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image: string
  property: string
}

export interface SliderProps {
  id: number
  title: string
  subtitle: string
  linkUrl: string
  imageUrl: string
  altText: string
}