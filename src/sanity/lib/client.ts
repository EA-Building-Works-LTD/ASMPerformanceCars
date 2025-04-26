import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})

// Set up a helper function for generating image URLs with the builder
const builder = imageUrlBuilder(client)

export const urlForImage = (source: SanityImageSource) => {
  return builder.image(source)
}

// Fetch all modified vehicles
export async function getModifiedVehicles() {
  return client.fetch(`
    *[_type == "modifiedVehicle"] {
      _id,
      _type,
      title,
      slug,
      price,
      mainImage,
      make,
      model,
      year,
      mileage,
      currentPower,
      currentTorque,
      fuelType,
      engineSize,
      transmission,
      featured,
      badges,
      extendedInfo,
      highlightedSpec,
      status,
      "specifications": {
        "vehicle": {
          "make": make,
          "model": model,
          "year": year,
          "bodyType": bodyType,
          "transmission": transmission,
          "fuelType": fuelType,
          "engineSize": engineSize,
          "doors": doors,
          "color": color,
          "status": status
        },
        "history": {
          "mileage": mileage,
          "owners": vehicleHistory.owners,
          "serviceHistory": vehicleHistory.serviceHistory,
          "mot": vehicleHistory.mot
        },
        "performance": {
          "power": currentPower,
          "torque": currentTorque
        }
      }
    } | order(
      select(
        defined(status) && (status match ["In Stock", "Available", "in stock", "available"]) => 1,
        defined(specifications.vehicle.status) && (specifications.vehicle.status match ["In Stock", "Available", "in stock", "available"]) => 1,
        0
      ) desc,
      price desc
    )
  `)
}

// Fetch all luxury vehicles
export async function getLuxuryVehicles() {
  return client.fetch(`
    *[_type == "luxuryVehicle"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      subtitle,
      extendedInfo,
      highlightedSpec,
      slug,
      price,
      priceOnApplication,
      mainImage,
      galleryImages,
      make,
      model,
      year,
      mileage,
      fuelType,
      engineSize,
      transmission,
      featured,
      badges,
      status,
      "specifications": {
        "performance": {
          "power": performance.horsepower,
          "torque": performance.torque,
          "acceleration": performance.acceleration,
          "topSpeed": performance.topSpeed
        },
        "vehicle": {
          "make": make,
          "model": model,
          "year": year,
          "bodyType": bodyType,
          "transmission": transmission,
          "fuelType": fuelType,
          "engineSize": engineSize,
          "doors": doors,
          "color": color.exterior,
          "status": status
        },
        "history": {
          "mileage": mileage,
          "owners": provenance.owners,
          "serviceHistory": provenance.serviceHistory,
          "mot": provenance.warrantyDetails
        },
        "features": luxuryFeatures
      },
      "mainImageUrl": mainImage.asset->url
    }
  `)
}

// Fetch all used vehicles
export async function getUsedVehicles() {
  return client.fetch(`
    *[_type == "vehicle"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      price,
      mainImage,
      make,
      model,
      year,
      mileage,
      fuelType,
      engineSize,
      transmission,
      featured,
      badges,
      extendedInfo,
      highlightedSpec,
      "specifications": {
        "performance": {
          "power": horsepower
        },
        "vehicle": {
          "make": make,
          "model": model,
          "year": year,
          "bodyType": bodyType,
          "transmission": transmission,
          "fuelType": fuelType,
          "engineSize": engineSize,
          "doors": doors,
          "color": color,
          "status": status
        },
        "history": {
          "mileage": mileage,
          "owners": vehicleHistory.owners,
          "serviceHistory": vehicleHistory.serviceHistory,
          "mot": vehicleHistory.mot
        }
      }
    }
  `)
}

// Fetch featured vehicles (both modified and luxury)
export async function getFeaturedVehicles() {
  return client.fetch(`
    *[(_type == "modifiedVehicle" || _type == "luxuryVehicle") && featured == true] | order(publishedAt desc)[0...3] {
      _id,
      _type,
      title,
      slug,
      price,
      mainImage,
      make,
      model,
      year,
      mileage,
      currentPower,
      currentTorque,
      fuelType,
      engineSize,
      transmission,
      featured,
      badges,
      extendedInfo,
      highlightedSpec,
      "specifications": {
        "vehicle": {
          "make": make,
          "model": model,
          "year": year,
          "bodyType": bodyType,
          "transmission": transmission,
          "fuelType": fuelType,
          "engineSize": engineSize,
          "doors": doors,
          "color": color,
        },
        "history": {
          "mileage": mileage,
          "owners": vehicleHistory.owners,
          "serviceHistory": vehicleHistory.serviceHistory,
          "mot": vehicleHistory.mot
        },
        "performance": {
          "power": coalesce(horsepower, currentPower),
          "torque": currentTorque
        }
      }
    }
  `)
}

// Fetch all vehicles (modified, luxury, and used)
export async function getAllVehicles() {
  try {
    return client.fetch(`
      *[_type in ["modifiedVehicle", "luxuryVehicle", "vehicle"]] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        price,
        priceOnApplication,
        mainImage,
        make,
        model,
        year,
        mileage,
        fuelType,
        engineSize,
        transmission,
        doors,
        featured,
        badges,
        extendedInfo,
        highlightedSpec,
        status,
        currentPower,
        currentTorque,
        "specifications": {
          "vehicle": {
            "make": make,
            "model": model,
            "year": year,
            "bodyType": bodyType,
            "transmission": transmission,
            "fuelType": fuelType,
            "engineSize": engineSize,
            "doors": doors,
            "color": color,
            "status": status
          },
          "history": {
            "mileage": mileage,
            "owners": vehicleHistory.owners,
            "serviceHistory": vehicleHistory.serviceHistory,
            "mot": vehicleHistory.mot
          },
          "performance": {
            "power": coalesce(horsepower, currentPower),
            "torque": currentTorque
          }
        }
      }
    `)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return [] // Return empty array as fallback
  }
}

// Fetch a single vehicle by slug
export async function getVehicleBySlug(slug: string, type: string) {
  const query = type === 'luxuryVehicle' 
    ? `*[_type == $type && slug.current == $slug][0] {
        _id,
        _type,
        title,
        subtitle,
        extendedInfo,
        highlightedSpec,
        slug,
        price,
        priceOnApplication,
        description,
        mainImage,
        galleryImages,
        badges,
        make,
        model,
        year,
        mileage,
        fuelType,
        engineSize,
        transmission,
        featured,
        bodyType,
        doors,
        luxuryFeatures,
        rarity,
        performance,
        color,
        provenance,
        modifications,
        status,
        categories,
        publishedAt,
        "specifications": {
          "performance": {
            "power": performance.horsepower,
            "torque": performance.torque,
            "acceleration": performance.acceleration,
            "topSpeed": performance.topSpeed
          },
          "vehicle": {
            "make": make,
            "model": model,
            "year": year,
            "bodyType": bodyType,
            "transmission": transmission,
            "fuelType": fuelType,
            "engineSize": engineSize,
            "doors": doors,
            "color": color.exterior,
            "status": status
          },
          "history": {
            "mileage": mileage,
            "owners": provenance.owners,
            "serviceHistory": provenance.serviceHistory,
            "mot": provenance.warrantyDetails
          },
          "features": luxuryFeatures,
          "modifications": {
            "items": modifications.items[] {
              category,
              name,
              description,
              brand,
              cost,
              images
            },
            "totalCost": modifications.totalCost,
            "warranty": modifications.warranty,
            "dynoGraph": modifications.dynoGraph
          }
        },
        "mainImageUrl": mainImage.asset->url
      }`
    : `*[_type == $type && slug.current == $slug][0] {
        _id,
        _type,
        title,
        extendedInfo,
        highlightedSpec,
        subtitle,
        slug,
        price,
        description,
        mainImage,
        galleryImages,
        badges,
        make,
        model,
        year,
        mileage,
        currentPower,
        originalPower,
        powerIncrease,
        fuelType,
        engineSize,
        transmission,
        featured,
        modifications,
        stage,
        dynoGraph,
        modificationCost,
        warranty,
        color,
        bodyType,
        doors,
        features,
        vehicleHistory {
          owners,
          serviceHistory,
          mot
        },
        status,
        categories,
        publishedAt,
        "specifications": {
          "performance": {
            "power": coalesce(horsepower, currentPower),
            "originalPower": originalPower,
            "powerIncrease": powerIncrease,
            "stage": stage,
            "torque": currentTorque
          },
          "vehicle": {
            "make": make,
            "model": model,
            "year": year,
            "bodyType": bodyType,
            "transmission": transmission,
            "fuelType": fuelType,
            "engineSize": engineSize,
            "doors": doors,
            "color": color,
            "status": status
          },
          "history": {
            "mileage": mileage,
            "owners": vehicleHistory.owners,
            "serviceHistory": vehicleHistory.serviceHistory,
            "mot": vehicleHistory.mot
          },
          "modifications": {
            "items": modifications[] {
              category,
              name,
              description,
              brand,
              cost,
              images
            },
            "totalCost": modificationCost,
            "warranty": warranty,
            "dynoGraph": dynoGraph
          },
          "features": features
        },
        "mainImageUrl": mainImage.asset->url
      }`

  return client.fetch(query, { slug, type })
}

// Fetch active hero slides
export async function getHeroSlides() {
  return client.fetch(`
    *[_type == "heroSlide" && active == true] | order(order asc) {
      _id,
      title,
      subtitle,
      image,
      mobileImage,
      textColor,
      overlayColor,
      buttonText,
      buttonLink,
      buttonStyle,
      secondaryButtonText,
      secondaryButtonLink,
      secondaryButtonStyle,
      textAlignment,
      textPosition,
      animation,
      order,
      active
    }
  `)
}

// Fetch testimonials
export async function getTestimonials() {
  return client.fetch(`
    *[_type == "testimonial" && active == true] | order(order asc) {
      _id,
      name,
      role,
      company,
      image,
      quote,
      stars,
      order,
      active
    }
  `)
}

// Fetch latest blog posts
export async function getLatestPosts(limit = 3) {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      "categories": categories[]->title,
      "authorName": author->name,
      "authorImage": author->image,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }
  `, { limit })
}

// Fetch call to action content
export async function getCallToAction() {
  return client.fetch(`
    *[_type == "callToAction" && active == true][0] {
      _id,
      title,
      description,
      backgroundImage,
      primaryButtonText,
      primaryButtonLink,
      primaryButtonIcon,
      secondaryButtonText,
      secondaryButtonLink,
      secondaryButtonIcon,
      stats
    }
  `)
}

export async function getMotCheckPage() {
  try {
    const page = await client.fetch(
      `*[_type == "motCheckPage"][0] {
        title,
        subtitle,
        "heroImage": heroImage.asset->url,
        whatIsMotTitle,
        whatIsMotContent,
        "whatIsMotImage": whatIsMotImage.asset->url,
        reportIncludesTitle,
        reportIncludesItems,
        "reportIncludesImage": reportIncludesImage.asset->url,
        whyFailTitle,
        whyFailContent,
        "whyFailImage": whyFailImage.asset->url,
        howHelpfulTitle,
        howHelpfulContent,
        dvlaCheckTitle,
        dvlaCheckContent,
        faqItems,
        ctaTitle,
        ctaSubtitle
      }`
    )
    return page || null
  } catch (error) {
    console.error("Error fetching MOT check page:", error)
    return null
  }
}

// Initialize the MOT check page document with default content if it doesn't exist
export async function initializeMotCheckPage() {
  // Check if the MOT check page already exists
  const existingPage = await client.fetch(`*[_type == "motCheckPage"][0]`);
  
  if (!existingPage) {
    // Create a new MOT check page document with the default content
    await client.create({
      _type: 'motCheckPage',
      title: 'MOT History Check',
      subtitle: 'Free MOT history check for any UK registered vehicle',
      whatIsMotTitle: 'What is an MOT?',
      whatIsMotContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Once your vehicle is around three years old, an MOT test is required every year. It ensures your car meets road safety and environmental standards, allowing drivers to stay safe and be legal to drive.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'If you own a vehicle, it is your job to ensure your MOT is valid. Without a valid MOT, your car insurance may become void. In the UK, it is illegal to drive your car without an MOT and insurance. You have the possibility of facing a fine of up to £1000 as well as 6/8 points on your license. This is covered under the Section 47 of the Road Traffic Act 1988.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'At the time of an MOT test, it is vital that every car meets the required minimum legal requirements. The certified individual, carrying out the MOT, will check essential items on your car to ensure it is fully complied. When an MOT is completed, you will receive an MOT certificate. It is important you understand what an MOT certificate means.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'The certificate does not guarantee the general mechanical condition of the vehicle. The MOT certificate confirms that the vehicle meets the legal minimum environmental and road safety requirements at the time of the test without disassembly. The certificate does not replace regular maintenance. The test does not include the condition of the engine, clutch or transmission.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      reportIncludesTitle: 'What does a FREE MOT history Report include?',
      reportIncludesItems: [
        { text: 'Check if a car has a valid MOT.' },
        { text: 'Keep upto date with your MOT.' },
        { text: 'Your MOT certificate expiry date.' },
        { text: 'Previous MOT history including advisories.' },
        { text: 'Mileage history to determine any discrepancies.' },
        { text: 'Failure notes. They provide a valuable insight into any car repairs carried out on a vehicle.' }
      ],
      whyFailTitle: 'Why would a car fail its MOT?',
      whyFailContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'A car may fail its MOT for many reasons. These reasons can be in the form of advisories or failures. You can see these reasons when you run a vehicle reg check using our MOT checker above.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Every MOT includes the same information which is legally required from an MOT test station. It is important to keep an eye on any advisories or failures as this can be the reason for an MOT failure.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      howHelpfulTitle: 'How is MOT history helpful?',
      howHelpfulContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'An MOT history check can help you keep up with how many days are left before your next MOT is required.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'It is important to ensure you are on top of your MOT to avoid driving your vehicle illegally. You may get stopped by the police if a car does not have a valid MOT.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      dvlaCheckTitle: 'Can you check a car\'s MOT history through DVLA?',
      dvlaCheckContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Yes, you are able to use the gov website to check the MOT status of any vehicle, provided you have the registration number to hand.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'If you ever lose an MOT certificate, you can simply use DVLA\'s online service to request a new one.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      faqItems: [
        {
          question: 'Lighting and Signaling',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Faulty bulbs, misaligned headlights, and damaged light lenses are among the most common reasons for MOT failures. Regular checks of all lights can help prevent this issue.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'Suspension Issues',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Worn shock absorbers, damaged springs, and deteriorated bushings can all cause MOT failures. Regular maintenance can help identify these issues before they become serious problems.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'Brake Problems',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Worn brake pads, discs, and fluid issues are common reasons for MOT failures. Regular brake inspections can help ensure your vehicle passes this critical safety check.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'Tire Condition',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Insufficient tread depth (below 1.6mm), damaged sidewalls, or uneven wear can all result in MOT failures. Regular tire checks and rotation can help prevent these issues.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'Visibility Issues',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Damaged windscreen (especially in the driver\'s line of sight), faulty wipers, and non-functioning washers can all lead to MOT failures. Regular checks of these components are essential.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        }
      ],
      ctaTitle: 'Check Your Vehicle\'s MOT History Today',
      ctaSubtitle: 'Get instant access to comprehensive MOT history, advisory notes, and more'
    });
    
    console.log('MOT check page document created in Sanity');
    return true;
  }
  
  console.log('MOT check page document already exists in Sanity');
  return false;
}

// Fetch SEO content for a specific page
export async function getSEOContent(page: string) {
  return client.fetch(`
    *[_type == "seoContent" && page == $page][0] {
      title,
      content
    }
  `, { page })
}

// Fetch site settings

// Fetch Our Cars page content
export async function getOurCarsPageContent() {
  return client.fetch(`
    *[_type == "ourCarsPage"][0] {
      title,
      description,
      stockPageTitle,
      stockPageDescription,
      stockPageSeo {
        metaTitle,
        metaDescription,
        keywords,
        "ogImageUrl": ogImage.asset->url
      },
      categories[] {
        title,
        description,
        "imageUrl": image.asset->url,
        buttonText,
        href
      },
      featuredSection {
        title,
        description
      },
      stockPageSeoContent {
        title,
        content
      },
      contactSection {
        buttonText
      }
    }
  `)
}

// Add a function to get modified cars page content
export async function getModifiedCarsPageContent() {
  try {
    return client.fetch(`
      *[_type == "modifiedCarsPage"][0] {
        heroTitle,
        heroDescription,
        cta1Text,
        cta1Link,
        cta2Text,
        cta2Link,
        uspSection {
          uspTitle1,
          uspDescription1,
          uspTitle2,
          uspDescription2,
          uspTitle3,
          uspDescription3
        },
        inventoryTitle,
        inventoryDescription,
        whyChooseTitle,
        whyChooseDescription,
        testimonial {
          quote,
          author,
          location
        },
        faqSection[] {
          question,
          answer
        },
        ctaSection {
          title,
          description,
          buttonText,
          buttonLink
        },
        seoContent
      }
    `)
  } catch (error) {
    console.error("Error fetching modified cars page content:", error)
    return null
  }
}

// Add a function to get luxury cars page content
export async function getLuxuryCarsPageContent() {
  try {
    return client.fetch(`
      *[_type == "luxuryCarsPage"][0] {
        heroTitle,
        heroDescription,
        heroImage,
        cta1Text,
        cta1Link,
        cta2Text,
        cta2Link,
        uspSection {
          uspTitle1,
          uspDescription1,
          uspTitle2,
          uspDescription2,
          uspTitle3,
          uspDescription3
        },
        inventoryTitle,
        inventoryDescription,
        brandsTitle,
        brandsDescription,
        brandLogos[] {
          name,
          "logoUrl": logo.asset->url
        },
        whyChooseTitle,
        whyChooseDescription,
        featureItems[] {
          title,
          description,
          icon
        },
        testimonial {
          quote,
          author,
          location
        },
        faqTitle,
        faqSection[] {
          question,
          answer
        },
        ctaSection {
          title,
          description,
          buttonText,
          buttonLink,
          secondaryButtonText,
          secondaryButtonLink
        },
        seoContent
      }
    `)
  } catch (error) {
    console.error("Error fetching luxury cars page content:", error)
    return null
  }
}

// Add a function to initialize the Luxury Cars Page document if it doesn't exist yet
export async function initializeLuxuryCarsPage() {
  try {
    // Check if the document already exists
    const existingDoc = await client.fetch(`*[_type == "luxuryCarsPage"][0]`);
    
    if (!existingDoc) {
      // Create a new document with default values
      await client.create({
        _type: 'luxuryCarsPage',
        _id: 'luxuryCarsPage',
        heroTitle: 'Premium <span class="text-red-600">Luxury Cars</span> For Sale',
        heroDescription: 'Explore our handpicked collection of exclusive luxury vehicles and supercars. We source only the finest examples, thoroughly inspected and professionally prepared for the discerning enthusiast.',
        uspSection: {
          uspTitle1: 'Exceptional Quality',
          uspDescription1: 'Our luxury cars undergo rigorous inspection and preparation to ensure they meet the highest standards of quality and performance.',
          uspTitle2: 'Verified History',
          uspDescription2: 'Every luxury vehicle comes with comprehensive documentation, including service history, ownership records, and thorough inspection reports.',
          uspTitle3: 'Bespoke Service',
          uspDescription3: 'Experience our personalised approach to luxury car buying, with tailored financing options and dedicated aftercare support.'
        },
        featureItems: [
          {
            title: 'Curated Selection',
            description: 'Each luxury car in our collection is hand-selected for its provenance, condition, specification, and investment potential.',
            icon: 'Star'
          },
          {
            title: 'Comprehensive Inspection',
            description: 'Our luxury vehicles undergo a meticulous multi-point inspection by marque specialists before being offered for sale.',
            icon: 'Shield'
          },
          {
            title: 'Bespoke Finance Solutions',
            description: 'We partner with specialist finance providers who understand the unique requirements of luxury car ownership.',
            icon: 'Settings'
          }
        ],
        seoContent: [
          {
            _type: 'block',
            style: 'h2',
            children: [
              {
                _type: 'span',
                text: 'Exceptional Luxury Cars for the Discerning UK Motorist'
              }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'At ASM Performance Cars, we specialise in offering the finest selection of luxury cars for sale in the UK. Our carefully curated collection showcases the very best in automotive engineering, design and craftsmanship from the world\'s most prestigious manufacturers.'
              }
            ]
          }
        ]
      });
      console.log('Created initial Luxury Cars Page document');
      return true;
    }
    
    console.log('Luxury Cars Page document already exists');
    return false;
  } catch (error) {
    console.error('Error initializing Luxury Cars Page:', error);
    return false;
  }
}

// Add a function to get used cars page content
export async function getUsedCarsPageContent() {
  try {
    return client.fetch(`
      *[_type == "usedCarsPage"][0] {
        heroTitle,
        heroDescription,
        cta1Text,
        cta1Link,
        cta2Text,
        cta2Link,
        uspSection {
          uspTitle1,
          uspDescription1,
          uspTitle2,
          uspDescription2,
          uspTitle3,
          uspDescription3
        },
        inventoryTitle,
        inventoryDescription,
        benefitsTitle,
        benefitsDescription,
        benefitItems[] {
          title,
          description,
          icon
        },
        popularMakesTitle,
        popularMakesDescription,
        popularMakes[] {
          name,
          "logoUrl": logo.asset->url
        },
        whyChooseTitle,
        whyChooseDescription,
        featureItems[] {
          title,
          description,
          icon
        },
        testimonial {
          quote,
          author,
          location
        },
        faqTitle,
        faqSection[] {
          question,
          answer
        },
        ctaSection {
          title,
          description,
          buttonText,
          buttonLink,
          secondaryButtonText,
          secondaryButtonLink
        },
        seoContent
      }
    `)
  } catch (error) {
    console.error("Error fetching used cars page content:", error)
    return null
  }
}

// Add a function to initialize the Used Cars Page document if it doesn't exist yet
export async function initializeUsedCarsPage() {
  try {
    // Check if the document already exists
    const existingDoc = await client.fetch(`*[_type == "usedCarsPage"][0]`);
    
    if (!existingDoc) {
      // Create a new document with default values
      await client.create({
        _type: 'usedCarsPage',
        _id: 'usedCarsPage',
        heroTitle: 'Quality <span class="text-red-600">Used Cars</span> For Sale',
        heroDescription: 'Explore our carefully selected collection of premium used cars. Each vehicle is meticulously inspected and professionally prepared to ensure exceptional quality and reliability.',
        uspSection: {
          uspTitle1: 'Quality Assurance',
          uspDescription1: 'Every used car undergoes a comprehensive multi-point inspection to ensure it meets our exacting standards before being offered for sale.',
          uspTitle2: 'Verified History',
          uspDescription2: 'All our used cars come with full documentation, including comprehensive service history and HPI checks for complete peace of mind.',
          uspTitle3: 'Aftercare Support',
          uspDescription3: 'Our relationship continues long after purchase with dedicated aftercare support to ensure your complete satisfaction with your used car.'
        },
        featureItems: [
          {
            title: 'Carefully Selected',
            description: 'Each used car in our collection is hand-picked based on its condition, history, and overall quality to ensure customer satisfaction.',
            icon: 'Check'
          },
          {
            title: 'Thorough Preparation',
            description: 'Our used vehicles undergo professional detailing and servicing to ensure they\'re in optimal condition before joining our forecourt.',
            icon: 'Settings'
          },
          {
            title: 'Competitive Pricing',
            description: 'We offer transparent, market-competitive pricing on all our used cars, providing excellent value without compromising on quality.',
            icon: 'Pound'
          }
        ],
        seoContent: [
          {
            _type: 'block',
            style: 'h2',
            children: [
              {
                _type: 'span',
                text: 'Premium Used Cars for the Discerning UK Driver'
              }
            ]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'At ASM Performance Cars, we specialise in offering a handpicked selection of quality used cars for sale in the UK. Our carefully curated collection showcases vehicles that meet our exacting standards for condition, performance, and value.'
              }
            ]
          }
        ]
      });
      console.log('Created initial Used Cars Page document');
      return true;
    }
    
    console.log('Used Cars Page document already exists');
    return false;
  } catch (error) {
    console.error('Error initializing Used Cars Page:', error);
    return false;
  }
}

export async function getFinancePage() {
  try {
    const page = await client.fetch(
      `*[_type == "financePage"][0] {
        title,
        metaDescription,
        keywords,
        heroTitle,
        heroSubtitle,
        "heroImage": heroImage.asset->url,
        heroCta,
        introTitle,
        introContent,
        "introImage": introImage.asset->url,
        financeOptionsTitle,
        financeOptionsSubtitle,
        financeOptions[]{
          title,
          description,
          "icon": icon.asset->url,
          highlights
        },
        processTitle,
        processSubtitle,
        processSteps[]{
          stepNumber,
          title,
          description
        },
        calculatorTitle,
        calculatorSubtitle,
        calculatorSettings,
        faqTitle,
        faqSubtitle,
        faqs[]{
          question,
          answer
        },
        "cta": {
          "title": ctaTitle,
          "subtitle": ctaSubtitle,
          "content": ctaContent,
          "primaryButtonText": ctaButtons.primary.text,
          "primaryButtonUrl": ctaButtons.primary.url,
          "secondaryButtonText": ctaButtons.secondary.text,
          "secondaryButtonUrl": ctaButtons.secondary.url,
          "backgroundColor": ctaButtons.backgroundColor,
          "buttonText": ctaButton.text,
          "buttonUrl": ctaButton.url
        }
      }`
    )
    return page || null
  } catch (error) {
    console.error("Error fetching finance page:", error)
    return null
  }
}

// Initialize the Finance page document with default content if it doesn't exist
export async function initializeFinancePage() {
  // Check if the finance page already exists
  const existingPage = await client.fetch(`*[_type == "financePage"][0]`);
  
  if (!existingPage) {
    // Create a new finance page document with the default content
    await client.create({
      _type: 'financePage',
      title: 'Car Finance',
      metaDescription: 'Explore our range of flexible car finance options tailored to your needs. Low rates, quick approval, and excellent customer service.',
      keywords: ['car finance', 'vehicle loans', 'auto finance', 'car financing UK', 'performance car finance'],
      
      // Hero Section
      heroTitle: 'Drive Away Today with Our Car Finance Options',
      heroSubtitle: 'Competitive rates and flexible terms tailored to your needs and budget',
      heroCta: {
        text: 'Calculate Your Payments',
        url: '#calculator'
      },
      
      // Introduction Section
      introTitle: 'Car Finance Made Simple',
      introContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'At ASM Performance Cars, we understand that purchasing your dream car should be an exciting experience, not a stressful one. That\'s why we offer straightforward, competitive financing options designed to get you behind the wheel with payment terms that fit your budget.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }, {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Our dedicated finance team works with multiple lenders to secure the best possible rates, regardless of your credit history. Whether you\'re looking for a modified performance vehicle, luxury supercar, or reliable used car, we have finance solutions to match.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      
      // Finance Options
      financeOptionsTitle: 'Finance Options',
      financeOptionsSubtitle: 'Choose the finance package that works best for you',
      financeOptions: [
        {
          title: 'Hire Purchase (HP)',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'A straightforward way to finance your vehicle with fixed monthly payments over an agreed period. At the end of the term, you own the vehicle outright.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }],
          highlights: ['Fixed interest rate', 'No large final payment', 'Flexible terms from 12-60 months', 'No mileage restrictions']
        },
        {
          title: 'Personal Contract Purchase (PCP)',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Lower monthly payments with options at the end of the term: pay the balloon payment to own the car, hand it back, or part-exchange for a new vehicle.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }],
          highlights: ['Lower monthly payments', 'Flexible end-of-term options', 'Ideal for those who like to change vehicles regularly', 'Terms typically 24-48 months']
        },
        {
          title: 'Personal Loan',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'A simple unsecured loan that gives you immediate ownership of the vehicle. Competitive rates available based on your credit history.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }],
          highlights: ['Immediate vehicle ownership', 'No security against the vehicle', 'Fixed monthly payments', 'Early repayment options']
        }
      ],
      
      // Finance Process
      processTitle: 'How Our Finance Process Works',
      processSubtitle: 'Getting finance for your dream car is quick and easy',
      processSteps: [
        {
          stepNumber: 1,
          title: 'Choose Your Vehicle',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Browse our extensive range of vehicles and find the perfect car for your needs and budget. Our team is on hand to answer any questions you might have.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          stepNumber: 2,
          title: 'Apply for Finance',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Complete our simple finance application form either online or in-dealership. We\'ll need some basic personal and financial information to process your application.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          stepNumber: 3,
          title: 'Receive Your Approval',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Our finance team will process your application and present you with the available options. In most cases, we can provide a decision within 1 hour during business hours.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          stepNumber: 4,
          title: 'Drive Away',
          description: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Once your finance is approved and paperwork completed, you\'re ready to drive away in your new car! The whole process can often be completed the same day.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        }
      ],
      
      // Calculator
      calculatorTitle: 'Calculate Your Monthly Payments',
      calculatorSubtitle: 'Use our simple calculator to estimate your monthly repayments',
      calculatorSettings: {
        defaultRate: 7.9,
        minLoanAmount: 1000,
        maxLoanAmount: 150000,
        minTerm: 12,
        maxTerm: 84,
        disclaimer: [{
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This calculator provides an estimate only. Final rates and payments will be determined based on your credit history and individual circumstances. Representative APR 7.9%. Subject to status.'
            }
          ],
          markDefs: [],
          style: 'normal'
        }]
      },
      
      // FAQ
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Find answers to common questions about our car finance options',
      faqs: [
        {
          question: 'What credit score do I need for car finance?',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'We work with a wide panel of lenders who cater to various credit profiles. While a good credit score will typically secure better rates, we have finance options available for all credit situations, including those with no credit history or past credit issues.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'How long does the finance application process take?',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'In most cases, we can provide a decision on your finance application within 1 hour during business hours. The complete process, including paperwork and vehicle preparation, can often be completed within the same day.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        },
        {
          question: 'Can I settle my finance agreement early?',
          answer: [{
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Yes, all of our finance agreements can be settled early. This may save you money on interest payments. Early settlement figures can be obtained directly from your finance provider, and we\'re happy to help guide you through this process.'
              }
            ],
            markDefs: [],
            style: 'normal'
          }]
        }
      ],
      
      // CTA
      ctaTitle: 'Ready to Get Started?',
      ctaSubtitle: 'Take the first step towards your dream car',
      ctaContent: [{
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Apply for finance today and take the first step towards driving your dream car. Our dedicated team is here to help you every step of the way.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }],
      ctaButton: {
        text: 'Calculate your payments',
        url: '#calculator'
      },
      ctaButtons: {
        primary: {
          text: 'Apply Now',
          url: '/services/finance/apply'
        },
        secondary: {
          text: 'Contact Us',
          url: '/contact'
        },
        backgroundColor: 'red'
      }
    });
    
    console.log('Finance page document created in Sanity');
    return true;
  }
  
  console.log('Finance page document already exists in Sanity');
  return false;
}

// Fetch related vehicles by make with fallback
export async function getRelatedVehicles(vehicleMake: string, vehicleId: string, limit = 4) {
  try {
    // First try to get vehicles with the same make, excluding current vehicle
    const relatedByMake = await client.fetch(`
      *[_type in ["modifiedVehicle", "luxuryVehicle", "vehicle"] && make == $make && _id != $currentId] | order(publishedAt desc)[0...$limit] {
        _id,
        _type,
        title,
        slug,
        price,
        priceOnApplication,
        mainImage,
        make,
        model,
        year,
        mileage,
        fuelType,
        engineSize,
        transmission,
        featured,
        badges,
        extendedInfo,
        highlightedSpec,
        status,
        currentPower,
        currentTorque,
        "specifications": {
          "vehicle": {
            "make": make,
            "model": model,
            "year": year,
            "bodyType": bodyType,
            "transmission": transmission,
            "fuelType": fuelType,
            "engineSize": engineSize,
            "doors": doors,
            "color": color,
            "status": status
          },
          "performance": {
            "power": coalesce(horsepower, currentPower),
            "torque": currentTorque
          }
        }
      }
    `, { make: vehicleMake, currentId: vehicleId, limit })

    // If we don't have enough related vehicles by make, get other vehicles
    if (relatedByMake.length < limit) {
      // Get additional vehicles (any type, excluding the current and already fetched)
      const excludeIds = [vehicleId, ...relatedByMake.map((v: any) => v._id)]
      const additionalVehicles = await client.fetch(`
        *[_type in ["modifiedVehicle", "luxuryVehicle", "vehicle"] && !(_id in $excludeIds)] | order(publishedAt desc)[0...${limit - relatedByMake.length}] {
          _id,
          _type,
          title,
          slug,
          price,
          priceOnApplication,
          mainImage,
          make,
          model,
          year,
          mileage,
          fuelType,
          engineSize,
          transmission,
          featured,
          badges,
          extendedInfo,
          highlightedSpec,
          status,
          "specifications": {
            "vehicle": {
              "make": make,
              "model": model,
              "year": year,
              "bodyType": bodyType,
              "transmission": transmission,
              "fuelType": fuelType,
              "engineSize": engineSize,
              "doors": doors,
              "color": color,
              "status": status
            }
          }
        }
      `, { excludeIds })

      return [...relatedByMake, ...additionalVehicles]
    }

    return relatedByMake
  } catch (error) {
    console.error("Error fetching related vehicles:", error)
    return [] // Return empty array as fallback
  }
}
