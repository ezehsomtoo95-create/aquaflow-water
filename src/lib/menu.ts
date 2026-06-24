export type MenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

export const menu: MenuItem[] = [
  {
    id: "10l",
    name: "10L Purified Water",
    price: 100,
    imageUrl: "/10l.png",
    description: "Crisp, purified hydration in a refillable 10-litre jug.",
  },
  {
    id: "20l",
    name: "20L Purified Water",
    price: 200,
    imageUrl: "/20l.png",
    description: "Family-size 20-litre jug for everyday refreshment.",
  },
  {
    id: "500ml-12",
    name: "500ml Bottled Water (Pack of 12)",
    price: 300,
    imageUrl: "/bottled.png",
    description: "Twelve perfectly chilled 500ml bottles, ready to go.",
  },
];
