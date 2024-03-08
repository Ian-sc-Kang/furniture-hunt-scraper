import { Injectable } from '@nestjs/common';

@Injectable()
export class CostcoCategorizer {
  private category = {
    'Living Room': {
      page: 'https://www.costco.com/living-room.html',
      subCategory: {
        'Accent & Coffee Tables': {
          page: 'https://www.costco.com/occasional-tables.html',
        },
        'Accent & Living Room Chairs': {
          page: 'https://www.costco.com/chairs.html',
        },
        'Accent Cabinets & Chests': {
          page: 'https://www.costco.com/chests.html',
        },
        'Coat Racks & Hall Trees': {
          page: 'https://www.costco.com/hall-trees.html',
        },
        'Futons & Sleeper Sofas': {
          page: 'https://www.costco.com/futons-loungers.html',
        },
        'Living Room Sets': {
          page: 'https://www.costco.com/living-room-sets.html',
        },
        Recliners: { page: 'https://www.costco.com/recliners.html' },
        'Sectional Sofas': {
          page: 'https://www.costco.com/sofas-sectionals.html',
        },
        'Sofas, Couches & Loveseats': {
          page: 'https://www.costco.com/sofas-couches.html',
        },
        'TV Stands & Entertainment Centers': {
          page: 'https://www.costco.com/entertainment-centers-TV-stands.html',
        },
      },
    },
    Bedroom: {
      page: 'https://www.costco.com/bedroom-furniture.html',
      subCategory: {
        'Bedroom Collections': {
          page: 'https://www.costco.com/bedroom-collections.html',
        },
        'Bedroom Sets': { page: 'https://www.costco.com/bedroom-sets.html' },
        'Beds & Bed Frames': {
          page: 'https://www.costco.com/bedroom-furniture-beds.html',
        },
        Daybeds: { page: 'https://www.costco.com/daybeds.html' },
        'Dressers & Chest of Drawers': {
          page: 'https://www.costco.com/bedroom-furniture-chests-dressers.html',
        },
        Headboards: { page: 'https://www.costco.com/headboards.html' },
        'Makeup Vanitites & Tables': {
          page: 'https://www.costco.com/makeup-vanities-tables.html',
        },
        'Murphy Beds & Wall Beds': {
          page: 'https://www.costco.com/wall-beds.html',
        },
        'Nightstands & Bedside Tables': {
          page: 'https://www.costco.com/bedroom-furniture-nightstands.html',
        },
      },
    },
    'Office & Home': {
      page: 'https://www.costco.com/office-furniture.html',
      subCategory: {
        'Bookcases & Bookshelves': {
          page: 'https://www.costco.com/office-furniture-bookcases.html',
        },
        'Chair Mats': { page: 'https://www.costco.com/mats.html' },
        'Desks & Workstations': {
          page: 'https://www.costco.com/desks-workstations.html',
        },
        'Filing & Office Storage Cabinets': {
          page: 'https://www.costco.com/filing-cabinets.html',
        },
        'Folding Tables & Chairs': {
          page: 'https://www.costco.com/tables.html',
        },
        'Office & Desk Chairs': {
          page: 'https://www.costco.com/office-chairs.html',
        },
        'Office Furniture Sets': {
          page: 'https://www.costco.com/office-furniture-collections.html',
        },
      },
    },
    'Kitchen & Dining Room': {
      page: 'https://www.costco.com/dining-kitchen.html',
      subCategory: {
        'Bar & Wine Cabinets': {
          page: 'https://www.costco.com/accent-furniture-bars.html',
        },
        'Bar Stools & Counter Stools': {
          page: 'https://www.costco.com/barstools.html',
        },
        'Kitchen & Dining Room Chairs': {
          page: 'https://www.costco.com/dining-chairs.html',
        },
        'Kitchen & Dining Room Sets': {
          page: 'https://www.costco.com/dining-kitchen-sets.html',
        },
        'Kitchen & Dining Room Tables': {
          page: 'https://www.costco.com/dining-tables.html',
        },
        'Kitchen Islands & Carts': {
          page: 'https://www.costco.com/kitchen-carts-islands.html',
        },
      },
    },
    Kid: {
      page: 'https://www.costco.com/youth-furniture.html',
      subCategory: {
        'Bunk & Loft Beds': { page: 'https://www.costco.com/bunk-beds.html' },
        'Kids Bedroom Collections': {
          page: 'https://www.costco.com/kids-collections.html',
        },
        'Kids Beds': { page: 'https://www.costco.com/beds.html' },
        'Kids Dressers': {
          page: 'https://www.costco.com/youth-furniture-chests-dressers.html',
        },
        "Kids' Bedroom Sets": {
          page: 'https://www.costco.com/kids-bedroom-sets.html',
        },
      },
    },
    'Nursery & Baby': {
      page: 'https://www.costco.com/nursery-furniture-decor.html',
      subCategory: {
        'Baby Cribs': { page: 'https://www.costco.com/baby-cribs.html' },
        'Nursery Furniture Sets': {
          page: 'https://www.costco.com/nursery-furniture-collections.html',
        },
      },
    },
  };

  categorize(keyword: string) {}
}
