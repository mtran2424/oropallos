/**
 * Global utility functions and constants for the application.
 */

// INTERFACES

// Model for product type
export interface ProductType {
  name: string;
  value: string;
}

// Model for product subcategory
export interface ProductSubcategory {
  name: string;
  types: ProductType[];
  value: string;
}

// Model for product category
export interface ProductCategory {
  name: string;
  subcategories: ProductSubcategory[];
  value: string;
}

// Model for product
export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory: string;
  type: string;
  imageUrl?: string;
}

// CONSTANTS

// Constants for types of each subcategory
const dryRedTypes = [
  { name: "Cabernet Sauvignon", value: "Cabernet_Sauvignon" },
  { name: "Merlot", value: "Merlot" },
  { name: "Pinot Noir", value: "Pinot_Noir" },
  { name: "Red Blend", value: "Red_Blend" },
  { name: "Malbec", value: "Malbec" },
  { name: "Cabernet Franc", value: "Cabernet_Franc" },
  { name: "Sangiovese", value: "Sangiovese" },
  { name: "Montepulciano", value: "Montepulciano" },
  { name: "Zinfandel", value: "Zinfandel" },
  { name: "Bordeaux", value: "Bordeaux" },
  { name: "Rioja", value: "Rioja" },
  { name: "Chianti", value: "Chianti" },
  { name: "Shiraz", value: "Shiraz" },
  { name: "Chateauneuf du Pape", value: "Chateauneuf_du_Pape" },
  { name: "Garnacha", value: "Garnacha" },
  { name: "Toscana", value: "Toscana" },
  { name: "Nero d'Avola", value: "Nero_dAvola" },
  { name: "Amarone", value: "Amarone" },
  { name: "Côtes du Rhône", value: "Cotes_du_Rhone" },
];

const sweetRedTypes = [
  { name: "Red Moscato", value: "Red_Moscato" },
  { name: "Sweet Red Blend", value: "Sweet_Red_Blend" },
  { name: "Sangria", value: "Sangria" },
  { name: "Lambrusco", value: "Lambrusco" },
  { name: "Table Wine", value: "Table_Wine" },
  { name: "Chocolate Wine", value: "Chocolate_Wine" },
];

const dryWhiteTypes = [
  { name: "Chardonnay", value: "Chardonnay" },
  { name: "Sauvignon Blanc", value: "Sauvignon_Blanc" },
  { name: "Pinot Grigio", value: "Pinot_Grigio" },
  { name: "Dry Riesling", value: "Dry_Riesling" },
  { name: "Vinho Verde", value: "Vinho_Verde" },
  { name: "Suave", value: "Suave" },
  { name: "White Rioja", value: "White_Rioja" },
  { name: "White Malbec", value: "White_Malbec" },
  { name: "White Bordeaux", value: "White_Bordeaux" },
];

const sweetWhiteTypes = [
  { name: "Moscato", value: "Moscato" },
  { name: "White Table Wine", value: "White_Table_Wine" },
  { name: "Sweet Riesling", value: "Sweet_Riesling" },
  { name: "Gewürztraminer", value: "Gewurztraminer" },
];

const drySparklingTypes = [
  { name: "Imported", value: "Imported" },
  { name: "Domestic", value: "Domestic" }
]

const sweetSparklingTypes = [
  { name: "Imported", value: "Imported" },
  { name: "Domestic", value: "Domestic" }
];

const vermouthTypes = [
  { name: "Dry", value: "Dry" },
  { name: "Sweet", value: "Sweet" },
];

const cookingTypes = [
  { name: "Marsala", value: "Marsala" },
  { name: "Sherry", value: "Sherry" },
  { name: "Madeira", value: "Madeira" },
];

const whiskeyTypes = [
  { name: "Bourbon", value: "Bourbon" },
  { name: "Scotch", value: "Scotch" },
  { name: "Irish", value: "Irish" },
  { name: "Canadian", value: "Canadian" },
  { name: "Japanese", value: "Japanese" },
];

const tequilaTypes = [
  { name: "Blanco", value: "Blanco" },
  { name: "Reposado", value: "Reposado" },
  { name: "Añejo", value: "Anejo" },
  { name: "Extra Añejo", value: "Extra_Anejo" },
];

const vodkaTypes = [
  { name: "Plain", value: "Plain" },
  { name: "Flavored", value: "Flavored" },
  { name: "Potato", value: "Potato" },
];

const rumTypes = [
  { name: "Light Rum", value: "Light_Rum" },
  { name: "Dark Rum", value: "Dark_Rum" },
  { name: "Spiced Rum", value: "Spiced_Rum" },
];

const brandyTypes = [
  { name: "Cognac", value: "Cognac" },
  { name: "Plain", value: "Plain" },
  { name: "Flavored", value: "Flavored" },
];

const cordialsTypes = [
  { name: "Amaretto", value: "Amaretto" },
  { name: "Irish Cream", value: "Irish_Cream" },
  { name: "Triple Sec", value: "Triple_Sec" },
  { name: "Peach Schnapps", value: "Peach_Schnapps" },
  { name: "Butterscotch Schnapps", value: "Butterscotch_Schnapps" },
  { name: "Peppermint Schnapps", value: "Peppermint_Schnapps" },
  { name: "Sour Apple Pucker", value: "Sour_Apple_Pucker" },
];

const rtdTypes = [
  { name: "Canned Cocktails", value: "Canned_Cocktails" },
  { name: "Wine Coolers", value: "Wine_Coolers" },
  { name: "Bottled Cocktails", value: "Bottled_Cocktails" },
];

// Constant defining product categories, subcategories and types
export const ProductCategories: ProductCategory[] = [
  {
    name: "Red Wines",
    subcategories: [
      { name: "Dry", types: dryRedTypes, value: "Dry" },
      { name: "Sweet", types: sweetRedTypes, value: "Sweet" },
      { name: "Semi Sweet", types: [], value: "Semi_Sweet" },
    ],
    value: "Red_Wine",
  },
  {
    name: "White Wines",
    subcategories: [
      { name: "Dry", types: dryWhiteTypes, value: "Dry" },
      { name: "Sweet", types: sweetWhiteTypes, value: "Sweet" },
      { name: "Semi Sweet", types: [], value: "Semi_Sweet" },
    ],
    value: "White_Wine",
  },
  {
    name: "Sparkling Wines",
    subcategories: [
      { name: "Dry", types: drySparklingTypes, value: "Dry" },
      { name: "Sweet", types: sweetSparklingTypes, value: "Sweet" },
    ],
    value: "Sparkling_Wine",
  },
  {
    name: "Blush Wines",
    subcategories: [
      { name: "Rose", types: [], value: "Rose" },
      { name: "Dry", types: [], value: "Dry" },
      { name: "Sweet", types: [], value: "Sweet" },
    ],
    value: "Blush_Wine",
  },
  {
    name: "Other Wines",
    subcategories: [
      { name: "Dessert", types: [], value: "Dessert" },
      { name: "Cooking", types: cookingTypes, value: "Cooking" },
      { name: "Vermouth", types: vermouthTypes, value: "Vermouth" },
    ],
    value: "Other_Wine",
  },
  {
    name: "Liquor",
    subcategories: [
      { name: "Whiskey", types: whiskeyTypes, value: "Whiskey" },
      { name: "Tequila", types: tequilaTypes, value: "Tequila" },
      { name: "Vodka", types: vodkaTypes, value: "Vodka" },
      { name: "Gin", types: [], value: "Gin" },
      { name: "Rum", types: rumTypes, value: "Rum" },
      { name: "Brandy", types: brandyTypes, value: "Brandy" },
      { name: "Cordials/Liqueurs/Schnapps", types: cordialsTypes, value: "Cordials_Liqueurs_Schnapps" },
      { name: "Ready-To-Drink", types: rtdTypes, value: "Ready_To_Drink" },
    ],
    value: "Liquor",
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

// Headers for product tables in admin view
export const productTableColumns = [
  { field: "id", label: "Product ID", width: "200px" },
  { field: "name", label: "Name", width: "200px" },
  { field: "price", label: "Price", width: "150px" },
  { field: "category", label: "Category", width: "200px" },
  { field: "subcategory", label: "Subcategory", width: "200px" },
  { field: "type", label: "Type", width: "250px" },
  { field: "description", label: "Description", width: "400px" },
  { field: "imageUrl", label: "Image URL", width: "400px" },
] as const;