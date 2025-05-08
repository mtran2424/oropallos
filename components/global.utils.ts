/**
 * Global utility functions and constants for the application.
 */

export interface WineCategory {
  name: string;
  subcategories: {
    name: string;
    wines: string[];
  }[];
}

export interface LiquorCategory {
  name: string;
  subcategories: {
    name: string;
  }[];
}

export const WineCategories: WineCategory[] = [
  {
    name: "Red Wines",
    subcategories: [
      {
        name: "Dry", wines: [
          "Cabernet Sauvignon",
          "Merlot",
          "Pinot Noir",
          "Malbec"
        ]
      },
      {
        name: "Sweet", wines: [
          "Zinfandel",
          "Port",
          "Shiraz",
          "Grenache"
        ]
      },
      {
        name: "Semi", wines: [
          "Sangiovese",
          "Tempranillo",
          "Barbera",
          "Syrah"
        ]
      },
    ],
  },
  {
    name: "White Wines",
    subcategories: [
      {
        name: "Dry", wines: [
          "Chardonnay",
          "Sauvignon Blanc",
          "Riesling",
          "Pinot Grigio"
        ]
      },
      {
        name: "Sweet", wines: [
          "Moscato",
          "Gewürztraminer",
          "Viognier",
          "Chenin Blanc"
        ]
      },
      {
        name: "Semi", wines: [
          "Semillon",
          "Verdelho",
          "Fiano",
          "Grüner Veltliner"
        ]
      }
    ],
  },
  {
    name: "Sparkling Wines",
    subcategories: [
      {
        name: "Dry", wines: [
          "Champagne",
          "Prosecco",
          "Cava",
          "Sekt"
        ]
      },
      {
        name: "Sweet", wines: [
          "Moscato d'Asti",
          "Asti Spumante",
          "Demi-Sec Champagne",
          "Brachetto d'Acqui"
        ]
      },
    ],
  },
  {
    name: "Rose",
    subcategories: [
      { name: "Dry", wines: [] },
      { name: "Sweet", wines: [] },
      { name: "Semi", wines: [] },
    ],
  },
  {
    name: "Other Wines",
    subcategories: [
      {
        name: "Blush", wines: [

        ]
      },
      { name: "Dessert", wines: [

      ] },
      { name: "Cooking", wines: [
          "Marsala",
          "Sherry",
          "Port",
          "Madeira"
      ] },
    ],
  },
] as const;

export const LiquorCategories = [{
  name: "Liquor",
  subcategories: [
    {
      name: "Whiskey", subtypes: [
        "Bourbon",
        "Scotch",
        "Irish",
        "Canadian",
        "Japanese",
      ]
    },
    {
      name: "Tequila", subtypes: [
        "Blanco",
        "Reposado",
        "Añejo",
        "Extra Añejo",
      ]
    },
    {
      name: "Vodka", subtypes: [
        "Plain",
        "Flavored",
        "Potato",
      ]
    },
    {
      name: "Gin", subtypes: [
        "London Dry",
      ]
    },
    {
      name: "Rum", subtypes: [
        "Light Rum",
        "Dark Rum",
        "Spiced Rum",
      ]
    },
    {
      name: "Brandy", subtypes: [
        "Cognac",
        "Plain",
        "Flavored",
      ]
    },
    {
      name: "Liqueur & others", subtypes: [
        "Amaretto",
        "Irish Cream",
        "Brandy",
        "Cognac",
      ]
    },
  ],
}] as const;

export const navBarElements = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
] as const;