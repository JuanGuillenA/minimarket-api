import type {
  Article,
  CashRegister,
  Client,
  FrequentClient,
  Role,
  Sale,
  Section,
  Supplier,
  User,
} from "./types";

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const demoSections: Section[] = [
  {
    _id: "sec-1",
    name: "Lácteos",
    description: "Refrigerados y derivados",
  },
  {
    _id: "sec-2",
    name: "Abarrotes",
    description: "Productos de consumo diario",
  },
  { _id: "sec-3", name: "Bebidas", description: "Bebidas frías y calientes" },
];

export const demoArticles: Article[] = [
  {
    _id: "art-1",
    barcode: "7861001000012",
    name: "Leche entera 1 L",
    retailPrice: 1.15,
    stockLevel: 8,
    sectionId: demoSections[0],
  },
  {
    _id: "art-2",
    barcode: "7861001000029",
    name: "Yogur natural 200 g",
    retailPrice: 0.85,
    stockLevel: 4,
    sectionId: demoSections[0],
  },
  {
    _id: "art-3",
    barcode: "7861001000036",
    name: "Arroz premium 1 kg",
    retailPrice: 1.6,
    stockLevel: 26,
    sectionId: demoSections[1],
  },
  {
    _id: "art-4",
    barcode: "7861001000043",
    name: "Aceite vegetal 900 ml",
    retailPrice: 2.75,
    stockLevel: 11,
    sectionId: demoSections[1],
  },
  {
    _id: "art-5",
    barcode: "7861001000050",
    name: "Agua mineral 600 ml",
    retailPrice: 0.65,
    stockLevel: 38,
    sectionId: demoSections[2],
  },
  {
    _id: "art-6",
    barcode: "7861001000067",
    name: "Café soluble 85 g",
    retailPrice: 3.9,
    stockLevel: 6,
    sectionId: demoSections[2],
  },
];

export const demoSuppliers: Supplier[] = [
  {
    _id: "sup-1",
    companyName: "Distribuidora Andina",
    contactEmail: "pedidos@andina.ec",
    phoneNumber: "099 245 1180",
  },
  {
    _id: "sup-2",
    companyName: "Comercial del Austro",
    contactEmail: "ventas@austro.ec",
    phoneNumber: "098 714 3022",
  },
];

export const demoClients: Client[] = [
  {
    _id: "cli-1",
    name: "María Pérez",
    identification: "0105589234",
    phone: "098 256 7710",
    email: "maria.perez@email.com",
    preferences: "Productos sin azúcar",
  },
  {
    _id: "cli-2",
    name: "Daniel Cabrera",
    identification: "0106834127",
    phone: "099 112 4590",
    email: "daniel.c@email.com",
    preferences: "Compra semanal",
  },
  {
    _id: "cli-3",
    name: "Lucía Torres",
    identification: "0104432871",
    phone: "096 814 3030",
    email: "lucia.t@email.com",
    preferences: "",
  },
];

export const demoRoles: Role[] = [
  {
    _id: "role-1",
    roleName: "Administrador",
    description: "Acceso general al sistema",
  },
  {
    _id: "role-2",
    roleName: "Cajero",
    description: "Ventas y manejo de caja",
  },
  {
    _id: "role-3",
    roleName: "Bodega",
    description: "Inventario y abastecimiento",
  },
];

export const demoUsers: User[] = [
  {
    id: "usr-1",
    username: "admin",
    fullName: "Ana Martínez",
    role: demoRoles[0],
    isActive: true,
  },
  {
    id: "usr-2",
    username: "caja01",
    fullName: "Carlos Vega",
    role: demoRoles[1],
    isActive: true,
  },
];

export const demoRegisters: CashRegister[] = [
  {
    _id: "reg-1",
    registerNumber: 1,
    status: "open",
    initialBalance: 50,
    currentBalance: 286.4,
  },
  {
    _id: "reg-2",
    registerNumber: 2,
    status: "closed",
    initialBalance: 40,
    currentBalance: 174.25,
    countedBalance: 174,
    difference: -0.25,
  },
];

export const demoSales: Sale[] = [
  {
    _id: "sale-1",
    registerId: "reg-1",
    paymentMethod: "cash",
    itemsSold: [
      { articleCode: "7861001000036", quantity: 2, unitPrice: 1.6 },
      { articleCode: "7861001000050", quantity: 3, unitPrice: 0.65 },
    ],
    subtotal: 5.15,
    discount: 0,
    totalAmount: 5.15,
    createdAt: daysAgo(0),
  },
  {
    _id: "sale-2",
    registerId: "reg-1",
    paymentMethod: "card",
    itemsSold: [{ articleCode: "7861001000067", quantity: 2, unitPrice: 3.9 }],
    subtotal: 7.8,
    discount: 0.5,
    totalAmount: 7.3,
    createdAt: daysAgo(1),
  },
  {
    _id: "sale-3",
    registerId: "reg-2",
    paymentMethod: "transfer",
    itemsSold: [{ articleCode: "7861001000043", quantity: 4, unitPrice: 2.75 }],
    subtotal: 11,
    discount: 0,
    totalAmount: 11,
    createdAt: daysAgo(2),
  },
  {
    _id: "sale-4",
    registerId: "reg-1",
    paymentMethod: "cash",
    itemsSold: [{ articleCode: "7861001000012", quantity: 8, unitPrice: 1.15 }],
    subtotal: 9.2,
    discount: 0,
    totalAmount: 9.2,
    createdAt: daysAgo(4),
  },
  {
    _id: "sale-5",
    registerId: "reg-2",
    paymentMethod: "card",
    itemsSold: [{ articleCode: "7861001000036", quantity: 6, unitPrice: 1.6 }],
    subtotal: 9.6,
    discount: 0.6,
    totalAmount: 9,
    createdAt: daysAgo(6),
  },
];

export const demoFrequentClients: FrequentClient[] = [
  {
    _id: "cli-1",
    clientId: "cli-1",
    name: "María Pérez",
    identification: "0105589234",
    totalPurchases: 12,
    totalAmount: 186.45,
  },
  {
    _id: "cli-2",
    clientId: "cli-2",
    name: "Daniel Cabrera",
    identification: "0106834127",
    totalPurchases: 8,
    totalAmount: 121.8,
  },
  {
    _id: "cli-3",
    clientId: "cli-3",
    name: "Lucía Torres",
    identification: "0104432871",
    totalPurchases: 5,
    totalAmount: 72.2,
  },
];
