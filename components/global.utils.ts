/**
 * Global utility functions and constants for the application.
 */

export interface ProductCategory {
  name: string;
  subcategories: {
    name: string;
    types: string[];
  }[];
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory: string;
  type: string;
}

export const ProductCategories: ProductCategory[] = [
  {
    name: "Red Wines",
    subcategories: [
      {
        name: "Dry", types: [
          "Cabernet Sauvignon",
          "Merlot",
          "Pinot Noir",
          "Red Blend",
          "Malbec",
          "Cabernet Franc",
          "Sangiovese",
          "Montepulciano",
          "Zinfandel",
          "Bordeaux"
        ]
      },
      {
        name: "Sweet", types: [
          "Zinfandel",
          "Port",
          "Shiraz",
          "Grenache"
        ]
      },
      {
        name: "Semi Sweet", types: [
        ]
      },
    ],
  },
  {
    name: "White Wines",
    subcategories: [
      {
        name: "Dry", types: [
          "Chardonnay",
          "Sauvignon Blanc",
          "Riesling",
          "Pinot Grigio"
        ]
      },
      {
        name: "Sweet", types: [
          "Moscato",
          "Gewürztraminer",
        ]
      },
      {
        name: "Semi Sweet", types: [
        ]
      }
    ],
  },
  {
    name: "Sparkling Wines",
    subcategories: [
      {
        name: "Dry", types: [
          "Champagne",
          "Prosecco",
          "Cava",
          "Brut",
          "Extra Dry",
          "Sparkling Rosé",
        ]
      },
      {
        name: "Sweet", types: [

        ]
      },
    ],
  },
  {
    name: "Rose",
    subcategories: [
      { name: "Dry", types: [] },
      { name: "Sweet", types: [] },
      { name: "Semi Sweet", types: [] },
    ],
  },
  {
    name: "Other Wines",
    subcategories: [
      {
        name: "Dessert", types: [

        ]
      },
      {
        name: "Cooking", types: [
          "Marsala",
          "Sherry",
          "Madeira"
        ]
      },
    ],
  },
  {
    name: "Liquor",
    subcategories: [
      {
        name: "Whiskey", types: [
          "Bourbon",
          "Scotch",
          "Irish",
          "Canadian",
          "Japanese",
        ]
      },
      {
        name: "Tequila", types: [
          "Blanco",
          "Reposado",
          "Añejo",
          "Extra Añejo",
        ]
      },
      {
        name: "Vodka", types: [
          "Plain",
          "Flavored",
          "Potato",
        ]
      },
      {
        name: "Gin", types: [
          "London Dry",
        ]
      },
      {
        name: "Rum", types: [
          "Light Rum",
          "Dark Rum",
          "Spiced Rum",
        ]
      },
      {
        name: "Brandy", types: [
          "Cognac",
          "Plain",
          "Flavored",
        ]
      },
      {
        name: "Cordials/Liqueurs/Schnapps", types: [
          "Amaretto",
          "Irish Cream",
          "Triple Sec",
          "Peach Schnapps",
          "Butterscotch Schnapps",
          "Peppermint Schnapps",
          "Sour Apple Pucker",
        ]
      },
      {
        name: "Ready-To-Drink", types: [
          "Canned Cocktails",
          "Wine Coolers",
          "Bottled Cocktails",
        ]
      },
    ]
  }
] as const;

export const navBarElements = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
] as const;

// Headers for product tables
export const productHeaders = [
  "Name",
  "Category",
  "Subcategory",
  "Type",
  "Description",
  "Price",
  "Actions"
] as const;

export const productTableColumns = [
  { field: "id", label: "Product ID", width: "200px" },
  { field: "name", label: "Name", width: "200px" },
  { field: "price", label: "Price", width: "150px" },
  { field: "category", label: "Category", width: "200px" },
  { field: "subcategory", label: "Subcategory", width: "200px" },
  { field: "type", label: "Type", width: "250px" },
  { field: "description", label: "Description", width: "300px" },
] as const;


export const categoryOptions = [
  { name: "Red Wine", value: "Red_Wine" },
  { name: "White Wine", value: "White_Wine" },
  { name: "Sparkling Wine", value: "Sparkling_Wine" },
  { name: "Rose", value: "Rose" },
  { name: "Other Wine", value: "Other_Wine" },
  { name: "Liquor", value: "Liquor" },
] as const;

export const wineSubcategoryOptions = [
  { name: "Dry", value: "Dry" },
  { name: "Sweet", value: "Sweet" },
  { name: "Semi Sweet", value: "Semi_Sweet" },
] as const;

export const otherWineSubcategoryOptions = [
  { name: "Dessert", value: "Dessert" },
  { name: "Cooking", value: "Cooking" },
] as const;

export const liquorSubcategoryOptions = [
  { name: "Whiskey", value: "Whiskey" },
  { name: "Tequila", value: "Tequila" },
  { name: "Vodka", value: "Vodka" },
  { name: "Gin", value: "Gin" },
  { name: "Rum", value: "Rum" },
  { name: "Brandy", value: "Brandy" },
  { name: "Cordials/Liqueurs/Schnapps", value: "Cordials_Liqueurs_Schnapps" },
  { name: "Ready-To-Drink", value: "Ready_To_Drink" },
] as const;