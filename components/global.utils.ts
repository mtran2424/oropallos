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
  favorite: boolean;
  abv?: number;
  size: string;
  upc?: string;
  hidden?: boolean;
  unitPrice?: number;
  unitCount: number;
  unitsPerCase?: number;
  createdAt?: Date;
}

export interface Announcement {
  id?: string;
  content: string;
  endDate: string;
  createdAt?: Date;
}

export interface TransactionItem {
  id?: string;
  name: string;
  quantity: number;
  itemPrice: number;
  unitPrice?: number;
  discount: string;
  type: string;
  productId?: string;
  product?: Product;
}

export interface Transaction {
  id?: string;
  status: string;
  batchId: string;
  register: string;
  notes: string;
  wineSubtotal: number;
  liquorSubtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  total: number;
  cash: number;
  credit: number;
  amountTendered: number;
  createdAt?: Date;
  transactionItems: TransactionItem[];
}

export interface Batch {
  id?: string;
  wineGross: number;
  liquorGross: number;
  gross: number;
  tax: number;
  void: number;
  cashTotal: number;
  creditTotal: number;
  register: string;
  discount: number;
  transactions: Transaction[];
  cardReceiptTotal: number;
  date?: Date;
}

export interface Config {
  id?: string;
  key: string;
  user: string | null;
  value: string;
}

export interface ConfigRequest {
  key: string;
  user: string | null;
  value: string;
}

export interface TransactionRequest {
  status: string;
  register: string;
  notes?: string;
  transactionItems: TransactionItem[];
}

export interface BatchRequest {
  wineGross: number;
  liquorGross: number;
  gross: number;
  tax: number;
  void: number;
  cashTotal: number;
  creditTotal: number;
  register: string;
  discount: number;
  transactions: { id: string | undefined }[];
}

export interface Discount {
  name: string;
  value: string;
  multiplier: number;
}

export const taxRate = 7;

export const noDiscount = {
  name: "No Discount",
  value: "No_Discount",
  multiplier: 1,
} as Discount;

export const fifteenPercentDiscount = {
  name: "Fifteen Percent",
  value: "Fifteen_Percent",
  multiplier: 0.85,
} as Discount;

export const taxFreeDiscount = {
  name: "Tax Free",
  value: "Tax_Free",
  multiplier: 1,
} as Discount;

export const getDiscount = (discount: string) => {
  switch (discount) {
    case "Fifteen_Percent":
      return fifteenPercentDiscount;
    case "Tax_Free":
      return taxFreeDiscount;
    default:
      return noDiscount;
  }
};

// CONSTANTS

// Constants for types of each subcategory
const dryRedTypes = [
  { name: "Cabernet Sauvignon", value: "Cabernet_Sauvignon" },
  { name: "Merlot", value: "Merlot" },
  { name: "Pinot Noir", value: "Pinot_Noir" },
  { name: "Red Blend", value: "Red_Blend" },
  { name: "Burgundy", value: "Burgundy" },
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
  { name: "Table Wine", value: "Table_Wine" },
  { name: "Valpolicella", value: "Valpolicella" },
];

const sweetRedTypes = [
  { name: "Red Moscato", value: "Red_Moscato" },
  { name: "Sweet Red Blend", value: "Sweet_Red_Blend" },
  { name: "Sangria", value: "Sangria" },
  { name: "Lambrusco", value: "Lambrusco" },
  { name: "Table Wine", value: "Table_Wine" },
  { name: "Chocolate Wine", value: "Chocolate_Wine" },
];

const semiRedTypes = [
  { name: "Table Wine", value: "Table_Wine" },
  { name: "Beaujolais", value: "Beaujolais" },
  { name: "Semi Sweet Red Blend", value: "Semi_Sweet_Red_Blend" },
];

const dryWhiteTypes = [
  { name: "Chardonnay", value: "Chardonnay" },
  { name: "Sauvignon Blanc", value: "Sauvignon_Blanc" },
  { name: "Pinot Grigio", value: "Pinot_Grigio" },
  { name: "Dry Riesling", value: "Dry_Riesling" },
  { name: "Vinho Verde", value: "Vinho_Verde" },
  { name: "Soave", value: "Soave" },
  { name: "White Rioja", value: "White_Rioja" },
  { name: "White Malbec", value: "White_Malbec" },
  { name: "White Bordeaux", value: "White_Bordeaux" },
  { name: "White Côtes du Rhône", value: "White_Cotes_du_Rhone" },
  { name: "White Blend", value: "White_Blend" },
  { name: "White Table Wine", value: "White_Table_Wine" },
  { name: "Blanc de Noir", value: "Blanc_de_Noir" },
  { name: "Sancerre", value: "Sancerre" },
  { name: "Chablis", value: "Chablis" },
];

const sweetWhiteTypes = [
  { name: "Moscato", value: "Moscato" },
  { name: "White Table Wine", value: "White_Table_Wine" },
  { name: "Sweet Riesling", value: "Sweet_Riesling" },
];

const semiWhiteTypes = [
  { name: "Riesling", value: "Riesling" },
  { name: "Gewürztraminer", value: "Gewurztraminer" },
  { name: "Table Wine", value: "Table_Wine" },
];

const drySparklingTypes = [
  { name: "Imported", value: "Imported" },
  { name: "Domestic", value: "Domestic" },
];

const sweetSparklingTypes = [
  { name: "Imported", value: "Imported" },
  { name: "Domestic", value: "Domestic" },
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

const dessertTypes = [
  { name: "Port", value: "Port" },
  { name: "Tawny Port", value: "Tawny_Port" },
  { name: "Cream Sherry", value: "Cream_Sherry" },
];

const whiskeyTypes = [
  { name: "Bourbon", value: "Bourbon" },
  { name: "Scotch", value: "Scotch" },
  { name: "Irish", value: "Irish" },
  { name: "Canadian", value: "Canadian" },
  { name: "Japanese", value: "Japanese" },
  { name: "Flavored", value: "Flavored" },
  { name: "Rye", value: "Rye" },
];

const tequilaTypes = [
  { name: "Blanco", value: "Blanco" },
  { name: "Reposado", value: "Reposado" },
  { name: "Añejo", value: "Anejo" },
  { name: "Extra Añejo", value: "Extra_Anejo" },
  { name: "Cristalino", value: "Cristalino" },
  { name: "Flavored", value: "Flavored" },
  { name: "Mezcal", value: "Mezcal" },
  { name: "Joven", value: "Joven" },
];

const vodkaTypes = [
  { name: "Unflavored", value: "Unflavored" },
  { name: "Flavored", value: "Flavored" },
];

const rumTypes = [
  { name: "Light Rum", value: "Light_Rum" },
  { name: "Dark Rum", value: "Dark_Rum" },
  { name: "Spiced Rum", value: "Spiced_Rum" },
  { name: "Gold Rum", value: "Gold_Rum" },
  { name: "Black Rum", value: "Black_Rum" },
  { name: "Flavored Rum", value: "Flavored_Rum" },
];

const brandyTypes = [
  { name: "Cognac", value: "Cognac" },
  { name: "Plain", value: "Plain" },
  { name: "Flavored", value: "Flavored" },
];

const cordialsTypes = [
  { name: "Amaretto", value: "Amaretto" },
  { name: "Creams", value: "Creams" },
  { name: "Schnapps", value: "Schnapps" },
  { name: "General Liqueurs", value: "General_Liqueurs" },
];

const rtdTypes = [
  { name: "Canned Cocktails", value: "Canned_Cocktails" },
  { name: "Bottled Cocktails", value: "Bottled_Cocktails" },
];

const cocktailTypes = [
  { name: "Cocktail Enhancements", value: "Cocktail_Enhancements" },
  { name: "Cocktail Mixes", value: "Cocktail_Mixes" },
];

// Constant defining product categories, subcategories and types
export const ProductCategories: ProductCategory[] = [
  {
    name: "Liquor",
    subcategories: [
      { name: "Whiskey", types: whiskeyTypes, value: "Whiskey" },
      { name: "Tequila", types: tequilaTypes, value: "Tequila" },
      { name: "Vodka", types: vodkaTypes, value: "Vodka" },
      { name: "Gin", types: [], value: "Gin" },
      { name: "Rum", types: rumTypes, value: "Rum" },
      { name: "Brandy", types: brandyTypes, value: "Brandy" },
      {
        name: "Cordials/Liqueurs/Schnapps",
        types: cordialsTypes,
        value: "Cordials_Liqueurs_Schnapps",
      },
      { name: "Ready-To-Drink", types: rtdTypes, value: "Ready_To_Drink" },
      { name: "Moonshine", types: [], value: "Moonshine" },
      { name: "Cocktails", types: cocktailTypes, value: "Cocktails" },
      { name: "Spirits", types: [], value: "Spirits" },
    ],
    value: "Liquor",
  },
  {
    name: "Red Wines",
    subcategories: [
      { name: "Dry", types: dryRedTypes, value: "Dry" },
      { name: "Sweet", types: sweetRedTypes, value: "Sweet" },
      { name: "Semi Sweet", types: semiRedTypes, value: "Semi_Sweet" },
    ],
    value: "Red_Wine",
  },
  {
    name: "White Wines",
    subcategories: [
      { name: "Dry", types: dryWhiteTypes, value: "Dry" },
      { name: "Sweet", types: sweetWhiteTypes, value: "Sweet" },
      { name: "Semi Sweet", types: semiWhiteTypes, value: "Semi_Sweet" },
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
    name: "Rosé Wines",
    subcategories: [
      { name: "Dry", types: [], value: "Dry" },
      { name: "Sweet", types: [], value: "Sweet" },
    ],
    value: "Rose_Wine",
  },
  {
    name: "Other Wines",
    subcategories: [
      { name: "Dessert", types: dessertTypes, value: "Dessert" },
      { name: "Cooking", types: cookingTypes, value: "Cooking" },
      { name: "Vermouth", types: vermouthTypes, value: "Vermouth" },
      { name: "Box Wine", types: [], value: "Box_Wine" },
      { name: "Organic", types: [], value: "Organic" },
      { name: "Low Calorie", types: [], value: "Low_Calorie" },
      {
        name: "Wine Based Beverages",
        types: [],
        value: "Wine_Based_Beverages",
      },
      { name: "Asian Wines", types: [], value: "Asian_Wines" },
      { name: "Kosher Wines", types: [], value: "Kosher_Wines" },
      { name: "Mead", types: [], value: "Mead" },
    ],
    value: "Other_Wine",
  },
] as const;

export const navBarElements = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
] as const;

export const adminNavBarElements = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Register", path: "/admin/register" },
] as const;

// Headers for product tables
export const productHeaders = [
  "Name",
  "Category",
  "Subcategory",
  "Type",
  "Description",
  "Price",
  "Actions",
] as const;

// Headers for product tables in admin view
export const productTableColumns = [
  { field: "id", label: "Product ID", width: "200px" },
  { field: "name", label: "Name", width: "300px" },
  { field: "price", label: "Price", width: "150px" },
  { field: "size", label: "Size", width: "200px" },
  { field: "abv", label: "ABV", width: "150px" },
  { field: "category", label: "Category", width: "200px" },
  { field: "subcategory", label: "Subcategory", width: "220px" },
  { field: "type", label: "Type", width: "250px" },
  { field: "description", label: "Description", width: "1000px" },
  { field: "imageUrl", label: "Image URL", width: "400px" },
  { field: "upc", label: "UPC", width: "200px" },
  { field: "unitPrice", label: "Unit Price", width: "150px" },
  { field: "unitCount", label: "Unit Count", width: "150px" },
] as const;

// Headers for manager tables in register view
export const managerTableColumns = [
  { field: "id", label: "Transaction ID", width: "75px" },
  { field: "createdAt", label: "Date/Time", width: "100px" },
  { field: "total", label: "Total", width: "100px" },
  { field: "register", label: "Register", width: "100px" },
  { field: "liquorSubtotal", label: "Liquor Subtotal", width: "150px" },
  { field: "wineSubtotal", label: "Wine Subtotal", width: "150px" },
  { field: "discount", label: "Discount", width: "150px" },
  { field: "cash", label: "Cash", width: "150px" },
  { field: "credit", label: "Credit", width: "150px" },
  { field: "tax", label: "Tax", width: "150px" },
  { field: "notes", label: "Notes", width: "200px" },
] as const;

// Headers for batch tables in register view
export const batchTableColumns = [
  { field: "id", label: "Batch ID", width: "75px" },
  { field: "date", label: "Date/Time", width: "200px" },
  { field: "register", label: "Register", width: "150px" },
  { field: "gross", label: "Gross Total", width: "150px" },
  { field: "wineGross", label: "Wine Gross", width: "150px" },
  { field: "liquorGross", label: "Liquor Gross", width: "150px" },
  { field: "discount", label: "Discount", width: "150px" },
  { field: "tax", label: "Tax", width: "150px" },
  { field: "cashTotal", label: "Cash Total", width: "150px" },
  { field: "creditTotal", label: "Credit Total", width: "150px" },
  { field: "void", label: "Void Total", width: "150px" },
  { field: "cardReceiptTotal", label: "Card Receipt Total", width: "200" },
] as const;

// Headers for product tables in admin view
export const announcementTableColumns = [
  { field: "id", label: "Announcement ID", width: "200px" },
  { field: "content", label: "Content", width: "1000px" },
  { field: "endDate", label: "End Date", width: "150px" },
] as const;

// Headers for product tables in admin view
export const inventoryTableColumns = [
  { field: "id", label: "Product ID", width: "200px" },
  { field: "name", label: "Name", width: "300px" },
  { field: "price", label: "Price", width: "150px" },
  { field: "size", label: "Size", width: "200px" },
  { field: "upc", label: "UPC", width: "200px" },
  { field: "unitPrice", label: "Unit Price", width: "150px" },
  { field: "unitCount", label: "Unit Count", width: "150px" },
  { field: "unitsPerCase", label: "Units Per Case", width: "150px" }
] as const;

// Headers for product tables in admin view
export const transactionItemTableColumns = [
  { field: "id", label: "Transaction Item ID", width: "100px" },
  { field: "name", label: "Name", width: "200px" },
  { field: "quantity", label: "Quantity", width: "100px" },
  { field: "itemPrice", label: "Item Price", width: "100px" },
  { field: "unitPrice", label: "Unit Price", width: "100px" },
  { field: "discount", label: "Discount", width: "200px" },
  { field: "productId", label: "Product ID", width: "200px" },
  { field: "type", label: "Type", width: "100px" },
] as const;

export const colorPool = [
  "#83C9F4",
  "#F71735",
  "#F9C22E",
  "#99D19C",
  "#3626A7",
  "#8093F1",
  "#6457A6",
  "#CC59D2",
  "#004385",
  "#FB6376",
  "#93E5AB",
  "#F487B6",
  "#ADE25D",
  "#FCEC52",
  "#F49CBB",
  "#23022E",
  "#9CFFD9",
  "#501537",
  "#473198",
] as const;

// Utility function to sanitize strings for search
export const sanitize = (str: string) =>
  str
    .normalize("NFD") // decompose accented characters into base + accent
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/gi, "") // remove non-alphanumerics
    .toLowerCase();

/**
 * Get the date array from a string in the format yyyy-mm-dd to be converted to numerics
 * and placed in array from left to right
 * @param date
 * @returns
 */
export const getDateObject = (date: string) => {
  const formatted = date.split("T")[0].split("-"); // Remove time part if present
  return {
    year: Number(formatted[0]),
    month: Number(formatted[1]) - 1,
    day: Number(formatted[2]),
  };
};
/**
 * Formats given date object to a format specified by string
 * Formats available: yyyy-mm-dd, mm/dd/yyyy
 * yyyy-mm-dd by default
 * @param date
 * @returns
 */
export const formatDate = (date: Date | null | undefined, format?: string) => {
  if (date === null || date === undefined) return null; // Handle null or undefined date

  if (format && format === "mm/dd/yyyy") {
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export const formatTime = (date: Date | null | undefined) => {
  if (date === null || date === undefined) return null; // Handle null or undefined date
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${date.getHours() >= 12 ? "PM" : "AM"}`;
}

export const getTotal = (item: TransactionItem) => {
  return (
    item.itemPrice *
    item.quantity *
    getDiscount(item.discount).multiplier *
    (item.type !== "Giftcard" ? (1 + taxRate / 100) : 1)
  );
};

export const getSubtotal = (item: TransactionItem) => {
  return item.itemPrice * item.quantity * getDiscount(item.discount).multiplier;
};

export const calculateSubtotal = (cart: TransactionItem[]) => {
  var total = 0;
  cart.map((item) => {
    total += getSubtotal(item);
  });

  return total;
};

export const calculateDiscount = (cart: TransactionItem[]) => {
  var total = 0;
  cart.map((item) => {
    total += item.itemPrice * item.quantity * (1 - getDiscount(item.discount).multiplier);
  });

  return total;
};

export const calculateTotal = (cart: TransactionItem[]) => {
  var total = 0;
  cart.map((item) => {
    total += getTotal(item);
  });

  return total;
};

export const calculateTax = (cart: TransactionItem[]) => {
  var total = 0;
  cart.filter((item) => item.type !== "Giftcard").map((item) => {
    total += getSubtotal(item) * (taxRate / 100);
  });
  return total;
};
