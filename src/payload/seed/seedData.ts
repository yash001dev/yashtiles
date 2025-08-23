export const seedSizes = [
  {
    name: '8" × 8"',
    dimensions: "Square format",
    aspectRatio: 1,
    price: 299,
    available: true,
    sortOrder: 1,
  },
  {
    name: '8" × 10"',
    dimensions: "Portrait format",
    aspectRatio: 8 / 10,
    price: 404,
    available: true,
    sortOrder: 2,
  },
  {
    name: '10" × 8"',
    dimensions: "Landscape format",
    aspectRatio: 10 / 8,
    price: 404,
    available: true,
    sortOrder: 3,
  },
  {
    name: '9" × 12"',
    dimensions: "Portrait format",
    aspectRatio: 9 / 12,
    price: 582,
    available: true,
    sortOrder: 4,
  },
  {
    name: '12" × 9"',
    dimensions: "Landscape format",
    aspectRatio: 12 / 9,
    price: 582,
    available: true,
    sortOrder: 5,
  },
  {
    name: '12" × 12"',
    dimensions: "Large square",
    aspectRatio: 1,
    price: 797,
    available: true,
    sortOrder: 6,
  },
  {
    name: '12" × 18"',
    dimensions: "Portrait format",
    aspectRatio: 12 / 18,
    price: 1218,
    available: true,
    sortOrder: 7,
  },
  {
    name: '18" × 12"',
    dimensions: "Landscape format",
    aspectRatio: 18 / 12,
    price: 1218,
    available: true,
    sortOrder: 8,
  },
  {
    name: '18" × 18"',
    dimensions: "Extra large square",
    aspectRatio: 1,
    price: 1900,
    available: true,
    sortOrder: 9,
  },
  {
    name: '18" × 24"',
    dimensions: "Portrait format",
    aspectRatio: 18 / 24,
    price: 2400,
    available: true,
    sortOrder: 10,
  },
  {
    name: '24" × 18"',
    dimensions: "Landscape format",
    aspectRatio: 24 / 18,
    price: 2400,
    available: true,
    sortOrder: 11,
  },
  {
    name: '24" × 32"',
    dimensions: "Large portrait",
    aspectRatio: 24 / 32,
    price: 4200,
    available: true,
    sortOrder: 12,
  },
  {
    name: '32" × 24"',
    dimensions: "Large landscape",
    aspectRatio: 32 / 24,
    price: 4200,
    available: true,
    sortOrder: 13,
  },
];

export const seedMaterials = [
  {
    name: "Classic Frame",
    description: "Traditional frame with mounting",
    content:
      "Timeless, premium look, printed on superios paper. Available in regular and wide frame options.",
    link: "https://www.freepik.com/search?format=search&last_filter=query&last_value=Classic+Frames&query=Classic+Frames",
    available: true,
    sortOrder: 1,
  },
  {
    name: "Frameless",
    description: "Clean, modern look",
    content:
      "Clean, modern look, printed on superios paper. with easy magenetic mounting.",
    link: "https://www.freepik.com/search?format=search&last_filter=query&last_value=Frameless+Frames&query=Frameless+Frames",
    available: true,
    sortOrder: 2,
  },
  {
    name: "Canvas",
    description: "Textured canvas finish",
    content:
      "wooden structure used to stretch and hold a canvas taut, providing a sturdy surface for painting and a way to display your artwork.",
    link: "https://www.freepik.com/search?format=search&last_filter=query&last_value=Canvas+Frames&query=Canvas+Frames",
    available: true,
    sortOrder: 3,
  },
];

export const seedFrameColors = [
  {
    name: "Black",
    color: "bg-gray-900",
    description: "Classic black finish",
    available: true,
    sortOrder: 1,
  },
  {
    name: "White",
    color: "bg-white border border-gray-200",
    description: "Clean white finish",
    available: true,
    sortOrder: 2,
  },
  {
    name: "Brown",
    color: "bg-amber-800",
    description: "Warm brown finish",
    available: true,
    sortOrder: 3,
  },
];

export const seedHangOptions = [
  {
    name: "Stickable Tape",
    description: "₹0",
    content:
      "Our unique offering. A stackable tape that you just have to peel off the backing and stick on your wall, it just works!",
    price: 0,
    available: true,
    sortOrder: 1,
  },
  {
    name: "Standard Hook",
    description: "₹0",
    content:
      "A classic trusted option for those looking for a solid solution. Hang them on nails with ease with our hook type frames.",
    price: 0,
    available: true,
    sortOrder: 2,
  },
];
