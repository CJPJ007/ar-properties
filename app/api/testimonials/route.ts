import { NextResponse } from "next/server"

const testimonials = [
  {
    id: "1",
    name: "Sarah & John Miller",
    role: "First-time Homebuyers",
    content:
      "Working with Ananta Realty exceeded our expectations in every way. Their market knowledge and negotiation skills helped us secure our dream home in a competitive market. The entire team demonstrated exceptional professionalism throughout the process.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
    property: "Modern Family Home in Highland Park",
  },
  {
    id: "2",
    name: "Emily Richardson",
    role: "Real Estate Investor",
    content:
      "As a luxury property investor, I appreciate Ananta Realty's attention to detail and their comprehensive market analysis. Their expertise in high-end real estate made my investment process seamless and profitable. Their after-sale support has been outstanding.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
    property: "Luxury Condo Complex Downtown",
  },
  {
    id: "3",
    name: "Michael Thompson",
    role: "Property Seller",
    content:
      "Having worked with several real estate agencies over the years, Ananta Realty stands out for their dedication to client satisfaction and market expertise. Their data-driven approach and transparent communication made selling my property a smooth experience.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
    property: "Luxury Villa above market value",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(testimonials)
}
