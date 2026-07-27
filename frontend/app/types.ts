export type EntityId = {
  _id?: string;
  id?: string;
};

export type Section = EntityId & {
  name: string;
  description: string;
  isActive?: boolean;
};

export type Article = EntityId & {
  barcode: string;
  name: string;
  retailPrice: number;
  stockLevel: number;
  sectionId: string | Section;
  createdAt?: string;
};

export type Supplier = EntityId & {
  companyName: string;
  contactEmail: string;
  phoneNumber: string;
  isActive?: boolean;
};

export type Client = EntityId & {
  name: string;
  identification: string;
  phone: string;
  email: string;
  preferences?: string;
  isActive?: boolean;
};

export type Role = EntityId & {
  roleName: string;
  description: string;
  isActive?: boolean;
};

export type User = EntityId & {
  username: string;
  fullName: string;
  role: Role | string;
  roleId?: Role | string;
  isActive?: boolean;
};

export type CashRegister = EntityId & {
  registerNumber: number;
  status: "open" | "closed";
  initialBalance: number;
  currentBalance: number;
  countedBalance?: number;
  difference?: number;
};

export type SaleItem = {
  articleCode: string;
  quantity: number;
  unitPrice: number;
};

export type Sale = EntityId & {
  registerId: string;
  paymentMethod: "cash" | "card" | "transfer";
  itemsSold: SaleItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  createdAt?: string;
};

export type FrequentClient = EntityId & {
  clientId: string;
  name: string;
  identification: string;
  totalPurchases: number;
  totalAmount: number;
};

export type CartItem = {
  article: Article;
  quantity: number;
};

export type ViewName =
  | "dashboard"
  | "checkout"
  | "catalog"
  | "inventory"
  | "supply"
  | "clients"
  | "access"
  | "reports";

export type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

