import { Session } from "next-auth"

export interface PropertyImage {
  id: string
  imageUrl: string
  altText: string
}

export interface Property {
  id: number
  slug: string
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
  cents: number
  propertyOfTheMonth: boolean
}

export interface Customer {
  id: string,
  name: string,
  email: string,
  mobile: string,
  avatar:string
}

export interface Testimonial {
  id: string
  youtubeUrl: string
}

export interface SliderProps {
  id: number
  title: string
  subtitle: string
  linkUrl: string
  imageUrl: string
  mobileImageUrl: string
  altText: string
}

export interface InquiryFormProps {
  property?: string
  showAppointmentDate?: boolean
  className?: string
}

export interface WishlistItem {
  id: number
  customer: Session['user']
  property: Property
}

export interface InquiryFormData {
  name: string
  email: string
  mobile: string
  property?: string
  appointmentDate?: string
  message: string
}
export interface Criteria{
  key:string,
  value?:string|null|undefined,
  operation:string
}
export interface AdvancedSearchRequest{
  criteriaList:Criteria[],
  operations:string[]
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  author?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailImage?: string;
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "inquiry" | "site_visit" | "property_update" | "system"
  read: boolean
  actionUrl?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  browser: boolean
  email: boolean
  inquiries: boolean
  siteVisits: boolean
  propertyUpdates: boolean
  system: boolean
}