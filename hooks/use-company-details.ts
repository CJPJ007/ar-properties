import useSWR from 'swr'

export type CompanyDetails = {
  id: number;
  companyName: string;
  tagline: string | null;
  aboutDescription: string | null;
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone: string | null;
  whatsappNumber: string | null;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  businessHoursWeekday: string | null;
  businessHoursWeekend: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  establishedYear: number | null;
  licenseNumber: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  referralAmount: string | null;
};

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useCompanyDetails() {
  const { data, error, isLoading } = useSWR<CompanyDetails[]>('/api/company-details', fetcher, { dedupingInterval: 10000 })
  return {
    company: data && data.length > 0 ? data[0] : null,
    isLoading,
    isError: !!error,
  }
} 