import React from 'react'
import { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { client } from '@/lib/sanity'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: 'Terms & Conditions | ASM Performance Cars',
  description: 'View our terms and conditions for using ASM Performance Cars services and website.',
  openGraph: {
    title: 'Terms & Conditions | ASM Performance Cars',
    description: 'View our terms and conditions for using ASM Performance Cars services and website.',
    url: 'https://asmperformancecars.co.uk/terms-conditions',
    siteName: 'ASM Performance Cars',
    locale: 'en_GB',
    type: 'website',
  },
}

const portableTextComponents = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-2xl font-bold text-red-600 mt-8 mb-4">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-semibold text-red-600 mt-5 mb-3">{children}</h3>,
    h4: ({ children }: { children: React.ReactNode }) => <h4 className="text-base font-semibold text-red-600 mt-4 mb-2">{children}</h4>,
    normal: ({ children }: { children: React.ReactNode }) => <p className="mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    number: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
    number: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  },
  marks: {
    link: ({ value, children }: { value: any; children: React.ReactNode }) => {
      const target = (value?.blank) ? '_blank' : undefined
      return (
        <a 
          href={value?.href} 
          target={target} 
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-red-600 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

async function getTermsContent() {
  try {
    const query = `*[_type == "termsConditions"][0]{
      title,
      lastUpdated,
      content,
      _updatedAt
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error("Error fetching terms & conditions content:", error)
    return null
  }
}

export default async function TermsConditionsPage() {
  const terms = await getTermsContent()
  
  // Fallback content if Sanity data isn't available yet
  const fallbackLastUpdated = "5 April 2025"
  
  return (
    <Layout>
      <div className="bg-gray-100 py-12">
        <Container>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white">
              <h1 className="text-3xl font-bold">{terms?.title || "Terms of Use for ASM Performance Cars"}</h1>
              <p className="mt-2 text-white/80">
                Last updated: {terms?.lastUpdated || fallbackLastUpdated}
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              {terms?.content ? (
                <div className="prose prose-red max-w-none">
                  <PortableText 
                    value={terms.content} 
                    components={portableTextComponents as PortableTextComponents} 
                  />
                </div>
              ) : (
                <div className="prose prose-red max-w-none">
                  <p>
                    Welcome to https://asmperformancecars.co.uk (the "Website"). These Terms and Conditions govern your use of our Website and the services we offer. By accessing or using our Website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with these terms, please do not use our Website.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">1. General Information</h2>
                  <p>
                    This Website is owned and operated by ASM Performance Cars ("we", "our", or "us"). Our registered business address is Unit 2, 74 Cooperative Street, Stafford, ST16 3DA. You can contact us by email at info@asmperformancecars.co.uk
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">2. Use of the Website</h2>
                  <p>By using our Website, you agree that:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>You are at least 18 years of age, or if you are under 18, you have the consent of your parent or guardian to use this Website.</li>
                    <li>You will not use the Website for any purpose that is illegal or prohibited by these Terms and Conditions.</li>
                    <li>You will not interfere with the proper functioning of the Website, including introducing viruses or harmful code.</li>
                    <li>You are responsible for maintaining the confidentiality of your account details and password.</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">3. Intellectual Property</h2>
                  <p>
                    All content on the Website, including text, images, graphics, logos, and software, is the property of ASM Performance Cars or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may use the content for personal, non-commercial purposes only. You are not permitted to copy, distribute, or use any part of the Website's content without our prior written consent.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">4. Product Listings and Services</h2>
                  <p>
                    ASM Performance Cars offers a variety of vehicles and services for sale. While we strive to provide accurate and up-to-date information about our products, we do not warrant that the descriptions or pricing information on the Website are complete, accurate, or free of errors. We reserve the right to change or update information, including prices, at any time without prior notice.
                  </p>
                  <p>
                    All sales and services are subject to availability. We reserve the right to refuse any order placed through the Website.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">5. Pricing and Payment</h2>
                  <p>
                    Prices for our products and services are subject to change without notice. We reserve the right to modify or discontinue products and services at any time. Prices displayed on the Website do not include taxes, shipping, or handling fees, which will be added to your total purchase cost at the time of checkout, where applicable.
                  </p>
                  <p>
                    Payment must be made in full at the time of purchase. We accept various payment methods as described on our website. By submitting your payment details, you confirm that the payment method belongs to you or that you have permission to use it.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">6. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by law, ASM Performance Cars shall not be liable for any direct, indirect, incidental, special, or consequential damages that result from your use of, or inability to use, the Website, including damages resulting from errors, omissions, or inaccuracies in the content provided on the Website.
                  </p>
                  <p>
                    We are not responsible for any loss or damage resulting from the unauthorised access of your account or any other matter related to your use of the Website.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">7. Third-Party Links and Content</h2>
                  <p>
                    Our Website may contain links to third-party websites or resources. These links are provided for your convenience only, and we do not endorse the content of these third-party sites. We are not responsible for the content, privacy policies, or practices of any third-party websites. We encourage you to review the terms and privacy policies of any websites you visit via links from our Website.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">8. User-Generated Content</h2>
                  <p>
                    If you submit any content to our Website, including reviews, comments, or other materials, you grant ASM Performance Cars a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute your content for any purpose. You agree that your submitted content will not infringe any third-party intellectual property rights, contain defamatory material, or violate any laws.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">9. Privacy Policy</h2>
                  <p>
                    Our Privacy Policy sets out how we handle your personal information. By using our Website, you agree to the terms of our Privacy Policy, which can be viewed on the Website.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">10. Changes to These Terms and Conditions</h2>
                  <p>
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be effective when posted on the Website. It is your responsibility to review these Terms and Conditions periodically to ensure that you are aware of any changes. Continued use of the Website following any changes indicates your acceptance of the modified Terms and Conditions.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">11. Governing Law</h2>
                  <p>
                    These Terms and Conditions, and any dispute or claim arising out of or in connection with them or their subject matter (including non-contractual disputes or claims), shall be governed by and construed in accordance with the laws of England and Wales.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">12. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us at:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>ASM Performance Cars</li>
                    <li>Unit 2, 74 Cooperative Street, Stafford, ST16 3DA</li>
                    <li>Email: info@asmperformancecars.co.uk</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
} 