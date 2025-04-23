import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// Helper function to check if a document exists
async function documentExists(id: string, type: string) {
  const query = `*[_type == $type && _id == $id][0]`;
  const params = { type, id };
  const document = await client.fetch(query, params);
  return !!document;
}

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { message: "This endpoint is only available in development mode" },
        { status: 403 }
      );
    }

    // Check if the services page document already exists
    const exists = await documentExists("servicesPage", "servicesPage");
    if (exists) {
      return NextResponse.json(
        { message: "Services page already exists in Sanity" },
        { status: 200 }
      );
    }

    // Create the services page document
    const servicesPageData = {
      _id: "servicesPage",
      _type: "servicesPage",
      title: "Our Services",
      description: "Explore our range of automotive services including finance, maintenance, MOT, valeting, and more.",
      seo: {
        title: "Our Services | ASM Performance Cars",
        description: "Explore our range of automotive services including finance, maintenance, MOT, valeting, and more.",
        keywords: [
          "car services", 
          "automotive services", 
          "car finance", 
          "vehicle servicing", 
          "MOT testing", 
          "car detailing", 
          "part exchange"
        ]
      },
      hero: {
        title: "Our Services",
        subtitle: "Comprehensive automotive services to meet all your vehicle needs"
      },
      servicesSection: {
        title: "Explore Our Services",
        subtitle: "From vehicle financing to maintenance, we provide a complete range of services for your automotive needs."
      },
      services: [
        {
          title: "Car Finance",
          description: "Flexible finance options tailored to your budget and requirements for purchasing your dream car.",
          icon: "BadgePoundSterling",
          link: "/services/finance",
          color: "bg-blue-50 dark:bg-blue-950",
          iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
          title: "Vehicle Servicing",
          description: "Professional servicing and maintenance to keep your vehicle running at its best.",
          icon: "Wrench",
          link: "/services/servicing",
          color: "bg-emerald-50 dark:bg-emerald-950",
          iconColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
          title: "Car Transportation",
          description: "Safe and secure transportation of vehicles across the UK with our professional car delivery service.",
          icon: "Truck",
          link: "/services/car-transportation",
          color: "bg-purple-50 dark:bg-purple-950",
          iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
          title: "MOT Testing",
          description: "Comprehensive MOT testing to ensure your vehicle meets all safety and environmental standards.",
          icon: "CheckCircle",
          link: "/services/mot",
          color: "bg-amber-50 dark:bg-amber-950",
          iconColor: "text-amber-600 dark:text-amber-400"
        },
        {
          title: "Vehicle Detailing",
          description: "Professional cleaning and detailing services to keep your car looking its best.",
          icon: "Sparkles",
          link: "/services/car-detailing",
          color: "bg-red-50 dark:bg-red-950",
          iconColor: "text-red-600 dark:text-red-400"
        },
        {
          title: "Part Exchange",
          description: "Trade in your existing vehicle as part payment towards your next car purchase.",
          icon: "ArrowLeftRight",
          link: "/services/part-exchange",
          color: "bg-indigo-50 dark:bg-indigo-950",
          iconColor: "text-indigo-600 dark:text-indigo-400"
        },
        {
          title: "Vehicle Warranty",
          description: "Extended warranty options to provide peace of mind and protection against unexpected repairs.",
          icon: "ShieldCheck",
          link: "/services/warranty",
          color: "bg-violet-50 dark:bg-violet-950",
          iconColor: "text-violet-600 dark:text-violet-400"
        }
      ],
      cta: {
        title: "Ready to Experience Our Services?",
        content: "Contact us today to learn more about how we can help with your automotive needs.",
        buttonText: "Contact Us Today",
        buttonUrl: "/contact",
        backgroundColor: "red"
      }
    };

    // Create the document in Sanity
    await client.createIfNotExists(servicesPageData);

    return NextResponse.json(
      { message: "Services page data seeded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding services page data:", error);
    return NextResponse.json(
      { message: "Failed to seed services page data", error },
      { status: 500 }
    );
  }
} 