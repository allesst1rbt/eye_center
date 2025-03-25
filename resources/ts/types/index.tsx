export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  lensId: number;
  customerSignature: string;
}

export interface Lens {
  id: number;
  name: string;
  fabricant: string;
  family: string;
  durability: number;
}
