import { type NextRequest, NextResponse } from "next/server"

const properties = [
  {
    id: "1",
    title: "Modern Family Home",
    price: "$450,000",
    beds: 4,
    baths: 3,
    sqft: "2,800 sq ft",
    location: "Highland Park",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    type: "house",
    featured: true,
  },
  {
    id: "2",
    title: "Luxury Condo",
    price: "$320,000",
    beds: 2,
    baths: 2,
    sqft: "1,400 sq ft",
    location: "Downtown",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    type: "condo",
    featured: true,
  },
  {
    id: "3",
    title: "Cozy Townhouse",
    price: "$280,000",
    beds: 3,
    baths: 2,
    sqft: "1,800 sq ft",
    location: "Riverside",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    type: "townhouse",
    featured: true,
  },
  {
    id: "4",
    title: "Luxury Villa",
    price: "$650,000",
    beds: 5,
    baths: 4,
    sqft: "4,200 sq ft",
    location: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    type: "luxury",
    featured: true,
  },
  {
    id: "5",
    title: "Luxury Waterfront Villa",
    price: "$750,000",
    beds: 5,
    baths: 4,
    sqft: "5,200 sq ft",
    location: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    type: "luxury",
    featured: false,
  },
  {
    id: "6",
    title: "Mountain Retreat Cabin",
    price: "$550,000",
    beds: 3,
    baths: 2,
    sqft: "2,400 sq ft",
    location: "Mountain View",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    type: "luxury",
    featured: false,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.toLowerCase() || ""

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.type.toLowerCase().includes(query) ||
      property.price.toLowerCase().includes(query),
  )

  return NextResponse.json(filteredProperties)
}
