import React from 'react'
import { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: 'Cookie Policy | ASM Performance Cars',
  description: 'Learn about how ASM Performance Cars uses cookies and similar technologies.',
  openGraph: {
    title: 'Cookie Policy | ASM Performance Cars',
    description: 'Learn about how ASM Performance Cars uses cookies and similar technologies.',
    url: 'https://asmperformancecars.co.uk/cookie-policy',
    siteName: 'ASM Performance Cars',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function CookiePolicyPage() {
  return (
    <Layout>
      <div className="bg-gray-100 py-12">
        <Container>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white">
              <h1 className="text-3xl font-bold">Cookie Policy</h1>
              <p className="mt-2 text-white/80">
                Last updated: 15 July 2025
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="prose prose-red max-w-none">
                <p>
                  This Cookie Policy explains how ASM Performance Cars ("we", "us", or "our") uses cookies and similar technologies 
                  when you visit our website at <a href="https://asmperformancecars.co.uk" className="text-red-600 hover:underline">asmperformancecars.co.uk</a>. 
                  This policy should be read alongside our <a href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</a>.
                </p>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. 
                  They allow the website to recognize your device and remember certain information about your visit, such as your 
                  preferences and actions. Cookies are widely used to make websites work more efficiently and provide valuable 
                  information to website owners.
                </p>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Types of Cookies We Use</h2>
                <p>We use the following types of cookies on our website:</p>
                
                <h3 className="text-lg font-semibold text-red-600 mt-5 mb-3">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, 
                  network management, and account access. You cannot opt out of these cookies as the website cannot function properly without them.
                </p>
                <table className="w-full border-collapse border border-gray-300 my-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 p-2 text-left">Purpose</th>
                      <th className="border border-gray-300 p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">XSRF-TOKEN</td>
                      <td className="border border-gray-300 p-2">Security cookie to prevent cross-site request forgery</td>
                      <td className="border border-gray-300 p-2">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">session</td>
                      <td className="border border-gray-300 p-2">Maintains user session state</td>
                      <td className="border border-gray-300 p-2">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">cookie_consent</td>
                      <td className="border border-gray-300 p-2">Stores your cookie consent preferences</td>
                      <td className="border border-gray-300 p-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 className="text-lg font-semibold text-red-600 mt-5 mb-3">Performance Cookies</h3>
                <p>
                  These cookies collect information about how visitors use our website, such as which pages they visit most often 
                  and if they receive error messages. They help us improve website performance and user experience.
                </p>
                <table className="w-full border-collapse border border-gray-300 my-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 p-2 text-left">Purpose</th>
                      <th className="border border-gray-300 p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">_ga</td>
                      <td className="border border-gray-300 p-2">Google Analytics - Distinguishes unique users</td>
                      <td className="border border-gray-300 p-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">_ga_[ID]</td>
                      <td className="border border-gray-300 p-2">Google Analytics - Maintains session state</td>
                      <td className="border border-gray-300 p-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">_gid</td>
                      <td className="border border-gray-300 p-2">Google Analytics - Identifies users</td>
                      <td className="border border-gray-300 p-2">24 hours</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">_gat</td>
                      <td className="border border-gray-300 p-2">Google Analytics - Throttles request rate</td>
                      <td className="border border-gray-300 p-2">1 minute</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 className="text-lg font-semibold text-red-600 mt-5 mb-3">Functional Cookies</h3>
                <p>
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party 
                  providers whose services we have added to our pages.
                </p>
                <table className="w-full border-collapse border border-gray-300 my-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 p-2 text-left">Purpose</th>
                      <th className="border border-gray-300 p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">user_preferences</td>
                      <td className="border border-gray-300 p-2">Stores user preferences for website customization</td>
                      <td className="border border-gray-300 p-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">recently_viewed_vehicles</td>
                      <td className="border border-gray-300 p-2">Tracks recently viewed vehicles for improved user experience</td>
                      <td className="border border-gray-300 p-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 className="text-lg font-semibold text-red-600 mt-5 mb-3">Targeting Cookies</h3>
                <p>
                  These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to 
                  limit the number of times you see an advertisement as well as help measure the effectiveness of advertising campaigns.
                </p>
                <table className="w-full border-collapse border border-gray-300 my-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 p-2 text-left">Purpose</th>
                      <th className="border border-gray-300 p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">_fbp</td>
                      <td className="border border-gray-300 p-2">Facebook - Used to deliver, measure and improve ads</td>
                      <td className="border border-gray-300 p-2">3 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">fr</td>
                      <td className="border border-gray-300 p-2">Facebook - Advertising and analytics</td>
                      <td className="border border-gray-300 p-2">3 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">IDE</td>
                      <td className="border border-gray-300 p-2">Google DoubleClick - Used for targeted advertising</td>
                      <td className="border border-gray-300 p-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Third-Party Cookies</h2>
                <p>
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
                  deliver advertisements, and so on. These cookies may be used when you visit our site or when you open emails from us.
                </p>
                <p>
                  The main third-party services we use that may set cookies are:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Google Analytics (for website analytics)</li>
                  <li>Google AdWords (for advertising)</li>
                  <li>Facebook (for social sharing and advertising)</li>
                  <li>Instagram (for social sharing and advertising)</li>
                  <li>YouTube (for video content)</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Managing Your Cookie Preferences</h2>
                <p>
                  When you first visit our website, you'll see a cookie banner that allows you to choose which cookies you accept. 
                  You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
                </p>
                <p>
                  You can also control cookies through your browser settings. Most web browsers allow some control of most cookies 
                  through browser settings. To find out more about cookies, including how to see what cookies have been set, visit 
                  <a href="https://www.aboutcookies.org" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer"> aboutcookies.org</a>.
                </p>
                <p>
                  Find out how to manage cookies on popular browsers:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><a href="https://support.google.com/accounts/answer/61416" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                  <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Safari (on macOS)</a></li>
                  <li><a href="https://support.apple.com/en-us/HT201265" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Safari (on iOS)</a></li>
                </ul>
                <p>
                  Please be aware that restricting cookies may impact the functionality of our website. For example, you may not be able 
                  to use some of our interactive features or save your preferences.
                </p>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Changes to Our Cookie Policy</h2>
                <p>
                  We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. 
                </p>
                
                <h2 className="text-xl font-semibold text-red-600 mt-6 mb-4">Contact Us</h2>
                <p>If you have any questions about our Cookie Policy, please contact us:</p>
                
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>By email: privacy@asmperformancecars.co.uk</li>
                  <li>By post: ASM Performance Cars, 74 Co-operative Street, Stafford ST16 3DA</li>
                  <li>By phone: +44 7306 657 000</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
} 