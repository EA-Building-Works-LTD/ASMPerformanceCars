import { type SchemaTypeDefinition } from 'sanity'

import { authorType } from './authorType'
import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'

// Import schema types
import { vehicleType } from './vehicleType'
import { modifiedVehicleType } from './modifiedVehicleType'
import { luxuryVehicleType } from './luxuryVehicleType'
import { dealershipType } from './dealershipType'
import { faqType } from './faqType'
import { testimonialType } from './testimonialType'
import { heroSlideType } from './heroSlideType'
import { motCheckToolType } from './motCheckToolType'
import { ctaType } from './ctaType'
import motCheckPageType from './motCheckPageType'
import { seoContentType } from './seoContentType'
import { seoType } from './seoType'
import { ourCarsPageType } from './ourCarsPage'
import { blogAdType } from './blogAdType'
import financePageType from './financePage'
import partExchangePageType from './partExchangePage'
import consignmentPageType from './consignmentPage'
import { contactPageType } from './contactPage'
import aboutPageType from './aboutPage'
import { luxuryCarsPageType } from './luxuryCarsPageType'
import privacyPolicyType from '../schemas/privacyPolicy'
import termsConditionsType from '../schemas/termsConditions'
import carTransportationPageType from './carTransportationPage'
import carDetailingPageType from './carDetailingPage'
import servicesPageType from './servicesPage'
import { tableType } from '../schemas/table'

export const schemaTypes = [
  // Content types
  postType,
  authorType,
  categoryType,
  blockContentType,
  blogAdType,
  tableType,
  
  // Vehicle types
  vehicleType,
  modifiedVehicleType,
  luxuryVehicleType,
  
  // Page types
  motCheckPageType,
  ourCarsPageType,
  financePageType,
  partExchangePageType,
  consignmentPageType,
  contactPageType,
  aboutPageType,
  // modifiedCarsPageType,
  luxuryCarsPageType,
  // usedCarsPageType,
  privacyPolicyType,
  termsConditionsType,
  carTransportationPageType,
  carDetailingPageType,
  servicesPageType,
  
  // Other types
  dealershipType,
  faqType,
  testimonialType,
  heroSlideType,
  motCheckToolType,
  ctaType,
  seoContentType,
  seoType,
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes as SchemaTypeDefinition[],
}
