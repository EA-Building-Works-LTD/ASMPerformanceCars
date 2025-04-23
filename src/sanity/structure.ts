import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      
      // Modified Vehicles with status grouping
      S.listItem()
        .title('Modified Vehicles')
        .child(
          S.list()
            .title('Modified Vehicles')
            .items([
              // All modified vehicles
              S.listItem()
                .title('All Modified Vehicles')
                .child(
                  S.documentTypeList('modifiedVehicle')
                    .title('All Modified Vehicles')
                ),
              
              // Available vehicles - Using a more permissive approach
              S.listItem()
                .title('Available Vehicles')
                .child(
                  S.documentList()
                    .title('Available Vehicles')
                    .filter('_type == "modifiedVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && (specifications.vehicle.status match "in stock" || specifications.vehicle.status match "available")) || status match "in stock" || status match "available")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Sold vehicles
              S.listItem()
                .title('Sold Vehicles')
                .child(
                  S.documentList()
                    .title('Sold Vehicles')
                    .filter('_type == "modifiedVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "sold") || status match "sold")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Coming Soon vehicles
              S.listItem()
                .title('Coming Soon')
                .child(
                  S.documentList()
                    .title('Coming Soon')
                    .filter('_type == "modifiedVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "coming soon") || status match "coming soon")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Reserved vehicles
              S.listItem()
                .title('Reserved Vehicles')
                .child(
                  S.documentList()
                    .title('Reserved Vehicles')
                    .filter('_type == "modifiedVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "reserved") || status match "reserved")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Pending Collection vehicles
              S.listItem()
                .title('Pending Collection')
                .child(
                  S.documentList()
                    .title('Pending Collection')
                    .filter('_type == "modifiedVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "pending collection") || status match "pending collection")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
            ])
        ),
      
      // Luxury Vehicles with status grouping
      S.listItem()
        .title('Luxury Supercars')
        .child(
          S.list()
            .title('Luxury Supercars')
            .items([
              // All luxury vehicles
              S.listItem()
                .title('All Luxury Vehicles')
                .child(
                  S.documentTypeList('luxuryVehicle')
                    .title('All Luxury Vehicles')
                ),
              
              // Available vehicles - Using a more permissive approach
              S.listItem()
                .title('Available Vehicles')
                .child(
                  S.documentList()
                    .title('Available Vehicles')
                    .filter('_type == "luxuryVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && (specifications.vehicle.status match "in stock" || specifications.vehicle.status match "available")) || status match "in stock" || status match "available")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Sold vehicles
              S.listItem()
                .title('Sold Vehicles')
                .child(
                  S.documentList()
                    .title('Sold Vehicles')
                    .filter('_type == "luxuryVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "sold") || status match "sold")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Coming Soon vehicles
              S.listItem()
                .title('Coming Soon')
                .child(
                  S.documentList()
                    .title('Coming Soon')
                    .filter('_type == "luxuryVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "coming soon") || status match "coming soon")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Reserved vehicles
              S.listItem()
                .title('Reserved Vehicles')
                .child(
                  S.documentList()
                    .title('Reserved Vehicles')
                    .filter('_type == "luxuryVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "reserved") || status match "reserved")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Pending Collection vehicles
              S.listItem()
                .title('Pending Collection')
                .child(
                  S.documentList()
                    .title('Pending Collection')
                    .filter('_type == "luxuryVehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "pending collection") || status match "pending collection")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
            ])
        ),
      
      // Used Cars with status grouping
      S.listItem()
        .title('Used Cars')
        .child(
          S.list()
            .title('Used Cars')
            .items([
              // All used cars
              S.listItem()
                .title('All Used Cars')
                .child(
                  S.documentTypeList('vehicle')
                    .title('All Used Cars')
                ),
              
              // Available vehicles - Using a more permissive approach
              S.listItem()
                .title('Available Vehicles')
                .child(
                  S.documentList()
                    .title('Available Vehicles')
                    .filter('_type == "vehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && (specifications.vehicle.status match "in stock" || specifications.vehicle.status match "available")) || status match "in stock" || status match "available")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Sold vehicles
              S.listItem()
                .title('Sold Vehicles')
                .child(
                  S.documentList()
                    .title('Sold Vehicles')
                    .filter('_type == "vehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "sold") || status match "sold")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Coming Soon vehicles
              S.listItem()
                .title('Coming Soon')
                .child(
                  S.documentList()
                    .title('Coming Soon')
                    .filter('_type == "vehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "coming soon") || status match "coming soon")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Reserved vehicles
              S.listItem()
                .title('Reserved Vehicles')
                .child(
                  S.documentList()
                    .title('Reserved Vehicles')
                    .filter('_type == "vehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "reserved") || status match "reserved")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
              
              // Pending Collection vehicles
              S.listItem()
                .title('Pending Collection')
                .child(
                  S.documentList()
                    .title('Pending Collection')
                    .filter('_type == "vehicle" && ((defined(specifications) && defined(specifications.vehicle) && defined(specifications.vehicle.status) && specifications.vehicle.status match "pending collection") || status match "pending collection")')
                    .defaultOrdering([{field: 'title', direction: 'asc'}])
                ),
            ])
        ),
      
      // Keep other document types
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'modifiedVehicle', 'luxuryVehicle', 'vehicle'].includes(item.getId()!),
      ),
      
      // Pages
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              // Singleton for modifiedCarsPage
              S.listItem()
                .title('Modified Cars Page')
                .child(
                  S.editor()
                    .id('modifiedCarsPage')
                    .schemaType('modifiedCarsPage')
                    .documentId('modifiedCarsPage')
                ),
              // Singleton for luxuryCarsPage
              S.listItem()
                .title('Luxury Cars Page')
                .child(
                  S.editor()
                    .id('luxuryCarsPage')
                    .schemaType('luxuryCarsPage')
                    .documentId('luxuryCarsPage')
                ),
              S.documentTypeListItem('ourCarsPage').title('Our Cars Page'),
            ])
        ),
    ])
