export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerNumber: string;
  lensId: string;
  dateId: string;
  customerSignature: string;
  date: Date | null;
}

export interface Lens {
  id: number;
  name: string;
}

export interface Dates {
  id: number;
  label: string;
}
