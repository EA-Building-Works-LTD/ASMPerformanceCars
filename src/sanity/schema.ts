import { type SchemaTypeDefinition } from 'sanity'
import { schemaTypes } from './schemaTypes'

// Import actual schema implementations from schemas directory
import luxuryVehicle from './schemas/luxuryVehicle'
import modifiedCarsPage from './schemas/modifiedCarsPage'
import modifiedVehicle from './schemas/modifiedVehicle'
import usedCarsPage from './schemas/usedCarsPage'
import vehicle from './schemas/vehicle'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Import all schema types from schemaTypes directory
    ...schemaTypes,
    
    // Add schema implementations from schemas directory
    vehicle,
    modifiedVehicle,
    luxuryVehicle,
    modifiedCarsPage,
    usedCarsPage,
  ] as SchemaTypeDefinition[],
} 