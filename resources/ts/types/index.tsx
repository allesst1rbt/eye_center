export interface Order {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_number: string;
  lens_id: number | null;
  customer_signature: string;
  term_id: number | null;
}

export interface Lens {
  id: number;
  name: string;
}

export interface Terms {
  id: number;
  expire_date: string;
}
