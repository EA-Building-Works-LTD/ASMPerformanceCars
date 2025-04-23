"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { urlForImage } from '@/sanity/lib/client';

export interface VehicleData {
  title: string;
  price: string;
  description: string;
  images: string[];
  mainImage: string;
  extendedInfo?: string;
  specifications: {
    engine?: string;
    bodyType?: string;
    owners?: number;
    odometer?: number;
    registered?: string;
    color?: string;
    vehicle?: {
      make: string;
      model: string;
      year: number;
      bodyType?: string;
      transmission: string;
      fuelType: string;
      engineSize?: string;
      color?: string;
      doors?: number;
      status?: string;
    };
    history?: {
      mileage: number;
      owners?: number;
      serviceHistory?: string;
      mot?: string;
    };
    performance?: {
      power: number;
      originalPower?: number;
      powerIncrease?: number;
      stage?: string;
    };
    modifications?: {
      items: {
        category?: string;
        name: string;
        description?: string;
        brand?: string;
        cost?: number;
        images?: unknown[];
      }[];
      totalCost?: number;
      warranty?: string;
      dynoGraph?: any;
    };
  };
  features?: string[];
  highlightedSpec?: string;
  logoUrl?: string;
}

// Helper function to load an image and return a promise
const loadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

export async function generateVehiclePDF(vehicle: VehicleData) {
  try {
    await createFallbackPDF(vehicle);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Helper function to load an image and get its dimensions
async function getImageDimensions(url: string): Promise<{ width: number; height: number; img: HTMLImageElement }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height, img });
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.crossOrigin = "anonymous"; // Enable CORS
    img.src = url;
  });
}

// Convert image to base64
async function getBase64Image(img: HTMLImageElement): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
}

// Add business info constant
const BUSINESS_INFO = {
  address: "74 Co-operative Street",
  city: "Stafford",
  postcode: "ST16 3DA",
  website: "www.asmperformancecars.co.uk",
  phone: "07306 657 000"
};

async function createFallbackPDF(vehicle: VehicleData) {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Add black header bar
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, 0, pageWidth, 30, 'F');

    // Add logo in header
    const logoPath = "/images/ASM Performance Cars Logo 2025 Dark Website Version.png";
    try {
      const logoHeight = 20;
      const logoWidth = 50;
      const logoX = (pageWidth - logoWidth) / 2;
      const logoY = 2.5;
      const logoDims = await getImageDimensions(logoPath);
      const logoBase64 = await getBase64Image(logoDims.img);
      pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error('Error adding logo:', error);
    }

    // Move position below header
    yPosition = 40;

    // Add title section with gray background - Dynamic height based on content
    const titleHeight = vehicle.extendedInfo || vehicle.highlightedSpec ? 35 : 20; // Adjust height based on content
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, yPosition - 10, pageWidth, titleHeight, 'F');

    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(51, 51, 51);
    pdf.text(vehicle.title, margin, yPosition);

    // Add price in red
    pdf.setTextColor(255, 0, 0);
    pdf.setFont("helvetica", "bold");
    const priceText = `£${formatPrice(vehicle.price)}`;
    const priceWidth = pdf.getTextWidth(priceText);
    pdf.text(priceText, pageWidth - margin - priceWidth, yPosition);

    // Add extended info as subtitle with reduced spacing
    if (vehicle.extendedInfo) {
      yPosition += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(102, 102, 102);
      const extendedInfoLines = pdf.splitTextToSize(vehicle.extendedInfo, pageWidth - (margin * 2));
      pdf.text(extendedInfoLines, margin, yPosition);
      yPosition += (extendedInfoLines.length * 5);
    }

    // Add highlighted spec if available
    if (vehicle.highlightedSpec) {
      yPosition += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(255, 0, 0); // Red color for highlighted spec
      const highlightedSpecLines = pdf.splitTextToSize(vehicle.highlightedSpec, pageWidth - (margin * 2));
      pdf.text(highlightedSpecLines, margin, yPosition);
      yPosition += (highlightedSpecLines.length * 5);
    }

    yPosition += 8; // Reduced spacing after all title content

    // New image layout with main image in center and 2 images on each side
    const totalWidth = pageWidth - (margin * 2);
    const mainImageWidth = totalWidth * 0.5; // 50% of available width
    const mainImageHeight = mainImageWidth * 0.75;
    
    // Increased side image dimensions
    const sideImageWidth = (totalWidth - mainImageWidth - margin) / 2; // Reduced margin between images
    const sideImageHeight = (mainImageHeight / 2) - (margin / 6); // Reduced gap between vertical images

    // Add main image in center
    if (vehicle.mainImage) {
      try {
        const mainImageX = margin + (totalWidth - mainImageWidth) / 2;
        const mainImageDims = await getImageDimensions(vehicle.mainImage);
        const imgBase64 = await getBase64Image(mainImageDims.img);
        pdf.addImage(imgBase64, 'JPEG', mainImageX, yPosition, mainImageWidth, mainImageHeight);
      } catch (error) {
        console.error('Error adding main image:', error);
      }
    }

    // Add side images with reduced gaps
    if (vehicle.images && vehicle.images.length > 0) {
      const galleryImages = vehicle.images.slice(0, 4);
      
      for (let i = 0; i < galleryImages.length; i++) {
        try {
          const isLeftSide = i < 2;
          const row = i % 2;
          
          const xPos = isLeftSide ? margin : pageWidth - margin - sideImageWidth;
          const yPos = yPosition + (row * (sideImageHeight + margin/4)); // Reduced vertical gap

          const imgDims = await getImageDimensions(galleryImages[i]);
          const imgBase64 = await getBase64Image(imgDims.img);
          pdf.addImage(imgBase64, 'JPEG', xPos, yPos, sideImageWidth, sideImageHeight);
        } catch (error) {
          console.error(`Error adding gallery image ${i}:`, error);
        }
      }
    }

    // Move position below images with extra spacing
    yPosition += mainImageHeight + margin;

    // Description section first
    pdf.setFillColor(248, 248, 248);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 60, 'F');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(51, 51, 51);
    pdf.text("Vehicle Description", margin + 10, yPosition + 5);
    pdf.setDrawColor(255, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 10, yPosition + 7, margin + 40, yPosition + 7);
    
    yPosition += 20;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const description = formatDescription(vehicle.description);
    const descriptionLines = pdf.splitTextToSize(description, pageWidth - (margin * 4));
    pdf.text(descriptionLines, margin + 10, yPosition);

    // Move position below description
    yPosition += 50;

    // Calculate grid layout dimensions
    const gridWidth = (pageWidth - (margin * 3)) / 2; // Width for each column
    const gridHeight = 55; // Reduced from 80 to 40 for both sections

    // Left column - Vehicle Details section
    pdf.setFillColor(248, 248, 248);
    pdf.rect(margin, yPosition - 5, gridWidth, gridHeight, 'F');

    // Section title - Vehicle Details
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12); // Reduced from 14 to 12
    pdf.setTextColor(51, 51, 51);
    pdf.text("Vehicle Details", margin + 10, yPosition + 3); // Reduced from +5 to +3
    
    // Red underline - Vehicle Details
    pdf.setDrawColor(255, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 10, yPosition + 5, margin + 40, yPosition + 5); // Reduced from +7 to +5

    // Details layout configuration
    const detailsConfig = {
      startY: yPosition + 13, // Reduced from 20 to 15
      labelX: margin + 10,
      valueX: margin + gridWidth - 15,
      lineHeight: 6, // Reduced from 10 to 6
      labelColor: [119, 119, 119] as [number, number, number],
      valueColor: [0, 0, 0] as [number, number, number]
    };

    // Add details with improved styling
    const detailsData = [
      { label: "ENGINE", value: vehicle.specifications?.vehicle?.engineSize || "" },
      { label: "BODY TYPE", value: vehicle.specifications?.vehicle?.bodyType || "" },
      { label: "OWNERS", value: vehicle.specifications?.history?.owners || "" },
      { label: "ODOMETER", value: vehicle.specifications?.history?.mileage ? 
                          `${vehicle.specifications.history.mileage.toLocaleString()} mi` : "" },
      { label: "REGISTERED", value: vehicle.specifications?.vehicle?.year ? 
                           `${vehicle.specifications.vehicle.year}` : "" },
      { label: "COLOUR", value: vehicle.specifications?.vehicle?.color || "" }
    ];

    detailsData.forEach((detail, index) => {
      const y = detailsConfig.startY + (index * detailsConfig.lineHeight);
      
      // Draw subtle dividing line
      if (index > 0) {
        pdf.setDrawColor(230, 230, 230);
        pdf.setLineWidth(0.1);
        pdf.line(
          margin + 10,
          y - (detailsConfig.lineHeight / 2),
          margin + gridWidth - 10,
          y - (detailsConfig.lineHeight / 2)
        );
      }

      // Add label (left-aligned, gray)
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8); // Reduced from 10 to 8
      pdf.setTextColor(...detailsConfig.labelColor);
      pdf.text(detail.label, detailsConfig.labelX, y);

      // Add value (right-aligned, black)
      if (detail.value) {
        pdf.setTextColor(...detailsConfig.valueColor);
        const valueWidth = pdf.getTextWidth(detail.value.toString());
        pdf.text(detail.value.toString(), detailsConfig.valueX - valueWidth, y);
      }
    });

    // Right column - Features section
    const featuresX = margin * 2 + gridWidth;
    pdf.setFillColor(248, 248, 248);
    pdf.rect(featuresX, yPosition - 5, gridWidth, gridHeight, 'F');

    // Section title - Features
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12); // Reduced from 14 to 12
    pdf.setTextColor(51, 51, 51);
    pdf.text("Features", featuresX + 10, yPosition + 2); // Reduced from +5 to +3
    
    // Red underline - Features
    pdf.setDrawColor(255, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(featuresX + 10, yPosition + 5, featuresX + 40, yPosition + 5); // Reduced from +7 to +5

    // Add features
    if (vehicle.features) {
      let featureY = yPosition + 15; // Reduced from 20 to 15
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8); // Reduced from 10 to 8
      pdf.setTextColor(51, 51, 51);
      
      vehicle.features.slice(0, 4).forEach((feature, index) => { // Reduced from 6 to 4 features
        const y = featureY + (index * 6); // Reduced from 10 to 6
        const bulletPoint = "•";
        pdf.text(bulletPoint, featuresX + 10, y);
        
        const featureLines = pdf.splitTextToSize(feature, gridWidth - 25);
        pdf.text(featureLines, featuresX + 15, y);
        featureY += (featureLines.length - 1) * 6;
      });
    }

    // Move position below both sections with reduced spacing
    yPosition += gridHeight + (margin / 2);

    // Footer with dynamic business info
    const footerY = pageHeight - 10;
    pdf.setFontSize(9);
    pdf.setTextColor(51, 51, 51);

    const addressLine = `${BUSINESS_INFO.address}, ${BUSINESS_INFO.city}, ${BUSINESS_INFO.postcode}`;
    pdf.text(addressLine, margin, footerY);
    
    const websiteWidth = pdf.getTextWidth(BUSINESS_INFO.website);
    const phoneWidth = pdf.getTextWidth(BUSINESS_INFO.phone);
    pdf.text(BUSINESS_INFO.website, pageWidth - margin - websiteWidth, footerY);
    pdf.text(BUSINESS_INFO.phone, pageWidth - margin - phoneWidth, footerY + 4);

    // Save PDF
    pdf.save(`${vehicle.title.replace(/\s+/g, '_')}.pdf`);
    console.log("PDF created successfully with ASM Performance layout");
  } catch (error) {
    console.error("Error creating PDF:", error);
  }
}

// Helper function to generate detail items with explicit hex colors
function generateDetailItem(label: string, value: unknown) {
  if (!value && value !== 0) return '';
  
  return `
    <div style="padding: 8px 0; border-bottom: 1px solid #eeeeee; display: flex; justify-content: space-between;">
      <span style="font-weight: bold; color: #666666; text-transform: uppercase; font-size: 12px;">${label}</span>
      <span style="color: #333333; font-size: 14px; font-weight: 500;">${value}</span>
    </div>
  `;
}

function formatPrice(price: string) {
  if (!price) return '';
  // Remove currency symbol and commas, then format
  const numericPrice = price.replace(/[£,]/g, '');
  return parseInt(numericPrice).toLocaleString();
}

function formatDescription(description: string) {
  if (!description) return '';
  
  // If description is a Sanity Portable Text array, extract and join text
  if (Array.isArray(description)) {
    try {
      return description
        .map(block => {
          if (block._type === 'block' && block.children) {
            return block.children.map((child: unknown) => child.text).join('');
          }
          return '';
        })
        .filter(text => text)
        .join('\n\n');
    } catch (error) {
      console.error('Error formatting description:', error);
      return Array.isArray(description) ? JSON.stringify(description) : description;
    }
  }
  
  return description;
} 