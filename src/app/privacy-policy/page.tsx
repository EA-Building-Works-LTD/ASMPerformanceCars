import React from 'react'
import { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: 'Privacy Policy | ASM Performance Cars',
  description: 'Learn about how ASM Performance Cars collects, uses and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy | ASM Performance Cars',
    description: 'Learn about how ASM Performance Cars collects, uses and protects your personal information.',
    url: 'https://asmperformancecars.co.uk/privacy-policy',
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
    link: ({ value, children }: { value?: { href?: string; blank?: boolean }; children: React.ReactNode }) => {
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

async function getPrivacyPolicyContent() {
  try {
    const query = `*[_type == "privacyPolicy"][0]{
      title,
      lastUpdated,
      content,
      _updatedAt
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error("Error fetching privacy policy content:", error)
    return null
  }
}

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await getPrivacyPolicyContent()
  
  // Fallback content if Sanity data isn't available yet
  const fallbackLastUpdated = "15 July 2025"
  
  return (
    <Layout>
      <div className="bg-gray-100 py-12">
        <Container>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white">
              <h1 className="text-3xl font-bold">{privacyPolicy?.title || "Privacy Policy for ASM Performance Cars"}</h1>
              <p className="mt-2 text-white/80">
                Last updated: {privacyPolicy?.lastUpdated || fallbackLastUpdated}
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              {privacyPolicy?.content ? (
                <div className="prose prose-red max-w-none">
                  <PortableText 
                    value={privacyPolicy.content} 
                    components={portableTextComponents} 
                  />
                </div>
              ) : (
                <div className="prose prose-red max-w-none">
                  <p>
                    ASM Performance Cars ("we", "us", "our") respects your privacy and is committed to protecting your personal information. 
                    This Privacy Policy describes how we collect, use, and protect your personal data when you visit our website 
                    at https://asmperformancecars.co.uk or use our services.
                  </p>
                  
                  <p>
                    By using our website or services, you agree to this Privacy Policy. If you do not agree, please do not use our website or services.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Who We Are</h2>
                  <p>
                    We are ASM Performance Cars, a specialist UK-based used car dealership specialising in modified cars, 
                    performance vehicles, luxury cars, and consignment car sales.
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Business Address:</strong> 74 Co-operative Street, Stafford ST16 3DA, UK</li>
                    <li><strong className="font-semibold">Contact Email:</strong> info@asmperformancecars.co.uk</li>
                    <li><strong className="font-semibold">Telephone:</strong> +44 7306 657 000</li>
                    <li><strong className="font-semibold">ICO Registration Number:</strong> ZC123456 (for data protection purposes)</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Information We Collect</h2>
                  <p>We collect and process the following types of personal data:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Identity Data:</strong> Name, username, title, date of birth, and gender.</li>
                    <li><strong className="font-semibold">Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                    <li><strong className="font-semibold">Financial Data:</strong> Bank account details, payment card details, and finance application details (where applicable).</li>
                    <li><strong className="font-semibold">Transaction Data:</strong> Details of products and services you have purchased from us, including consignment car sales.</li>
                    <li><strong className="font-semibold">Technical Data:</strong> IP address, browser type, location, device information, operating system, and unique device identifiers.</li>
                    <li><strong className="font-semibold">Usage Data:</strong> Information about how you use our website, including page views, navigation paths, referring websites, clicks, scroll behavior, and time spent on pages.</li>
                    <li><strong className="font-semibold">Marketing and Communications Data:</strong> Your preferences in receiving marketing and newsletters from us, including email open rates and click-through data.</li>
                    <li><strong className="font-semibold">Vehicle Interest Data:</strong> Information about vehicles you've viewed, saved, or enquired about.</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">How We Collect Your Data</h2>
                  <p>We collect personal data through:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Direct interactions</strong> via forms on our website (enquiries, test drives, finance applications).</li>
                    <li><strong className="font-semibold">Communications</strong> via email, phone, or social media platforms.</li>
                    <li><strong className="font-semibold">Automated technologies:</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Essential cookies</strong> that enable core website functionality</li>
                        <li><strong>Performance cookies</strong> that help us analyze site usage (Google Analytics)</li>
                        <li><strong>Functional cookies</strong> that remember your preferences</li>
                        <li><strong>Targeting cookies</strong> that track your interests and deliver relevant ads</li>
                        <li><strong>Social media cookies</strong> from platforms like Facebook and Instagram</li>
                        <li><strong>Pixel tracking</strong> for conversion measurement</li>
                      </ul>
                    </li>
                    <li><strong className="font-semibold">Third-party referrals</strong> from car listing sites, finance partners, and dealership networks.</li>
                    <li><strong className="font-semibold">Publicly available sources</strong> such as Companies House and social media platforms.</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Cookie Management</h2>
                  <p>
                    When you first visit our website, you'll be presented with a cookie consent banner allowing you to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Accept all cookies</li>
                    <li>Decline non-essential cookies</li>
                    <li>Customize your cookie preferences</li>
                  </ul>
                  <p>
                    You can change your cookie preferences at any time through our Cookie Preferences Centre, 
                    accessible via the footer of our website. For detailed information about the specific cookies we use, 
                    please see our <a href="/cookie-policy" className="text-red-600 hover:underline">Cookie Policy</a>.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">How We Use Your Information</h2>
                  <p>We use your personal information for the following purposes:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Providing our products and services, including vehicle sales, consignment services, and aftercare.</li>
                    <li>Processing enquiries, finance applications, and vehicle purchases.</li>
                    <li>Managing our relationship with you (e.g., notifications, after-sales services).</li>
                    <li>Marketing our services, promotions, and special offers (with your explicit consent).</li>
                    <li>Personalizing your experience based on your preferences and previous interactions.</li>
                    <li>Ensuring website security, fraud prevention, and anti-money laundering compliance.</li>
                    <li>Analyzing and improving website functionality, user experience, and marketing effectiveness.</li>
                    <li>Conducting market research to enhance our product offerings and services.</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Legal Basis for Processing</h2>
                  <p>We rely on the following lawful bases for processing your personal data:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Consent:</strong> You have provided clear, affirmative consent to process your data for a specific purpose, such as receiving marketing emails or enabling non-essential cookies.</li>
                    <li><strong className="font-semibold">Contractual Necessity:</strong> Processing data to fulfil contracts, e.g., vehicle sales, consignment services, and aftercare services.</li>
                    <li><strong className="font-semibold">Legal Obligations:</strong> Complying with our legal obligations and regulations (e.g., tax records, anti-money laundering, FCA requirements).</li>
                    <li><strong className="font-semibold">Legitimate Interest:</strong> Marketing to existing customers, improving website services, and customer service (balancing against your rights and freedoms).</li>
                  </ul>
                  
                  <p><strong>Special note on marketing communications:</strong> We will only send you marketing emails with your explicit consent. Each marketing email contains an unsubscribe link, allowing you to opt out at any time.</p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Data Sharing</h2>
                  <p>We may share your data with selected third parties:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Service providers:</strong> Website hosting (Vercel), content management (Sanity), CRM systems, payment processors, and email service providers.</li>
                    <li><strong className="font-semibold">Business partners:</strong> Finance companies, insurance providers, warranty companies, and vehicle history check services.</li>
                    <li><strong className="font-semibold">Analytics providers:</strong> Google Analytics, Facebook Pixel, and similar services to analyze website traffic and marketing effectiveness.</li>
                    <li><strong className="font-semibold">Regulatory authorities:</strong> HMRC, FCA, law enforcement, or other legal entities when legally obligated.</li>
                    <li><strong className="font-semibold">Vehicle-related third parties:</strong> DVLA, transport companies, and consignment partners.</li>
                  </ul>
                  
                  <p>We require all third parties to respect your data security and to treat your personal data in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes. We never sell your personal data to third parties.</p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">International Transfers</h2>
                  <p>
                    Some of our external third parties are based outside the UK or European Economic Area (EEA), so their processing of your personal data may involve a transfer outside the UK/EEA.
                  </p>
                  
                  <p>
                    When we transfer your personal data outside the UK/EEA, we ensure a similar degree of protection by implementing at least one of these safeguards:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Only transferring data to countries deemed to provide an adequate level of protection for personal data by the UK government.</li>
                    <li>Using specific contracts approved by the UK Information Commissioner that give personal data the same protection it has in the UK.</li>
                    <li>Where we use providers based in the US, ensuring they are part of UK approved data protection frameworks.</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Data Security</h2>
                  <p>
                    We have implemented appropriate technical and organizational security measures to prevent accidental loss, unauthorized access, 
                    alteration, or disclosure of your personal data, including:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>SSL/TLS encryption for all website traffic and form submissions</li>
                    <li>Secure access controls and authentication for all data storage systems</li>
                    <li>Regular security assessments and vulnerability scanning</li>
                    <li>Staff training on data protection and security best practices</li>
                    <li>Secure, encrypted storage of all sensitive personal information</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Your Rights Under UK GDPR</h2>
                  <p>Under UK GDPR, you have the following rights:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong className="font-semibold">Right to be informed</strong> about how we use your personal data.</li>
                    <li><strong className="font-semibold">Right of access</strong> to request copies of your personal data.</li>
                    <li><strong className="font-semibold">Right to rectification</strong> to correct inaccurate or incomplete data.</li>
                    <li><strong className="font-semibold">Right to erasure</strong> (to be forgotten) in certain circumstances.</li>
                    <li><strong className="font-semibold">Right to restrict processing</strong> in certain circumstances.</li>
                    <li><strong className="font-semibold">Right to data portability</strong> to obtain and reuse your data.</li>
                    <li><strong className="font-semibold">Right to object</strong> to certain processing, including direct marketing.</li>
                    <li><strong className="font-semibold">Rights related to automated decision making and profiling</strong>.</li>
                  </ul>
                  
                  <p>To exercise your rights, please contact our Data Protection Officer at privacy@asmperformancecars.co.uk or write to the address below. We will respond to all legitimate requests within one month.</p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">How Long We Retain Data</h2>
                  <p>
                    We retain personal data only for as long as necessary for the purpose collected or as required by law:
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Customer account data: For the duration of your relationship with us plus 6 years</li>
                    <li>Transaction data: 7 years for tax and financial regulations</li>
                    <li>Marketing preferences: Until you opt-out or withdraw consent</li>
                    <li>Website usage data: 26 months for analytics purposes</li>
                    <li>Enquiry data: 3 years from last communication</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Children's Privacy</h2>
                  <p>
                    Our services are not directed at individuals under 18. We do not knowingly collect personal data from children. 
                    If you believe we have collected data from a child, please contact us immediately.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Your Right to Complain</h2>
                  <p>
                    If you are unhappy with how we've handled your data, you can complain to the Information Commissioner's Office (ICO):
                  </p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Website: <a href="https://ico.org.uk/make-a-complaint/" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a></li>
                    <li>Telephone: 0303 123 1113</li>
                    <li>Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
                  </ul>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Changes to this Privacy Policy</h2>
                  <p>
                    We regularly review our privacy policy to ensure it accurately reflects our data processing practices and current legal requirements. 
                    Any changes will be posted on this page with an updated revision date. Significant changes will be notified to you directly where possible.
                  </p>
                  
                  <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Contact Us</h2>
                  <p>If you have questions regarding this Privacy Policy or how we handle your personal data, please contact us:</p>
                  
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Data Protection Officer: privacy@asmperformancecars.co.uk</li>
                    <li>General enquiries: info@asmperformancecars.co.uk</li>
                    <li>By post: ASM Performance Cars, 74 Co-operative Street, Stafford ST16 3DA</li>
                    <li>By phone: +44 7306 657 000</li>
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