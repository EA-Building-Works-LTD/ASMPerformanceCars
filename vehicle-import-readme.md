# Vehicle Import Scripts

These scripts allow you to import vehicles into your Sanity database from a CSV file.

## Prerequisites

- Node.js installed
- Sanity project with appropriate schemas
- Sanity write token (API token with write permissions)

## Setup

1. Make sure you have the required environment variables set:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_TOKEN` (write token)

2. You can set these in a `.env` file in the root of your project.

## CSV Format

Your CSV file should have the following columns (headers are required):

```
make,model,year,price,mileage,owners,fuelType,transmission,exteriorColor,interiorColor,registration,priceDisplay,description,condition,vehicleType,status,kmValue,engineSizeCC,bhp,torque,isImported,previousOwners,serviceHistory
```

### Example row:

```
Subaru,Impreza WRX,1996,5495,86000,2,Petrol,Manual,Silver,Black,P243 KPY,POA,"Subaru Impreza WRX, 137k km (approx. 86k miles), HPI clear, 11 months MOT, imported in 2005. Remapped to 282.8bhp with Dyno printout. 3"" turboback exhaust with 4"" exit, Mishimoto alloy radiator, lightweight KRS Racing gold wheels, genuine high-rise spoiler, STI rear lights, alloy bonnet, Momo wheel, colour-coded skirts, uprated brakes. Folder of paperwork included.",Excellent,modified_car,available,137000,1994,283,270,TRUE,7,Full
```

### Required Fields

The following fields are required:
- make
- model
- year
- price
- mileage
- fuelType
- transmission
- exteriorColor
- status

### Field Formats

- **vehicleType**: Should be one of: `vehicle`, `modified_car`, or `luxury_car`
- **fuelType**: Should be one of: `Petrol`, `Diesel`, `Hybrid`, or `Electric`
- **transmission**: Should be one of: `Manual`, `Automatic`, or `Semi-Automatic`
- **status**: Should be one of: `available`, `sold`, `reserved`, or `coming soon`
- **isImported**: Should be `TRUE` or `FALSE`
- **serviceHistory**: Should be one of: `Full`, `Partial`, or `None`

## Usage

### 1. Validate your CSV file

Always validate your CSV file before importing to check for errors:

```bash
npm run validate-vehicles-csv -- path/to/your/vehicles.csv
```

The validator will check your data for errors and provide feedback.

### 2. Import vehicles

Once your CSV has been validated, you can import the vehicles:

```bash
npm run import-vehicles -- path/to/your/vehicles.csv
```

The import script will:
1. Extract vehicle features from the description
2. Format the data according to your Sanity schema
3. Handle special fields for modified vehicles
4. Create the vehicle documents in your Sanity database

## Notes

- The import script handles both regular vehicles and modified vehicles automatically based on the `vehicleType` field.
- For modified vehicles, it will calculate an estimated original power (80% of current power).
- Features are automatically extracted from the description.
- The script generates a slug based on make, model, and year.
- Vehicles with `POA` in the `priceDisplay` field will have the `priceOnApplication` flag set to true.

## Troubleshooting

If you encounter errors during the import:

1. Check that your Sanity API token has write permissions
2. Validate your CSV file format
3. Make sure all required fields are present
4. Check the console output for specific error messages 