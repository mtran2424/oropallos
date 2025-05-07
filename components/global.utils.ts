/**
 * Global utility functions and constants for the application.
 */

export const ProductCategories = [
  {
    name: "Red Wines",
    subcategories: [
      {
        name: "Dry", wines: [

        ]
      },
      {
        name: "Sweet", wines: [

        ]
      },
      {
        name: "Semi", wines: [

        ]
      }
    ]
  },
  {
    name: "White Wines",
    subcategories: [
      {
        name: "Dry", wines: [

        ]
      },
      {
        name: "Sweet", wines: [

        ]
      },
      {
        name: "Semi", wines: [

        ]
      }
    ]
  },
  {
    name: "Sparkling Wines",
    subcategories: [
      {
        name: "Dry", wines: [

        ]
      },
      {
        name: "Sweet", wines: [

        ]
      },
      {
        name: "Semi", wines: [

        ]
      }
    ]
  },
  {
    name: "Other Wines",
    subcategories: [
      {
        name: "Rose", wines: [

        ]
      },
      {
        name: "Dessert", wines: [

        ]
      },
      {
        name: "Cooking", wines: [

        ]
      }
    ]
  },
  {
    name: "Rose",
    subcategories: [
      {
        name: "Dry", wines: [

        ]
      },
      {
        name: "Sweet", wines: [

        ]
      },
      {
        name: "Semi", wines: [

        ]
      }
    ]
  },
  {
    name: "Liquor",
    subcategories: [
      {
        name: "Whiskey", wine: [

        ]
      },
      {
        name: "Tequila", wine: [

        ]
      },
      {
        name: "Vodka", wine: [

        ]
      },
      {
        name: "Rum", wine: [

        ]
      },
      {
        name: "Gin", wine: [

        ]
      },
      {
        name: "Liquer & others", wine: [

        ]
      },
    ]
  },
] as const;

export const navBarElements = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Products", path: "/products" },
] as const;