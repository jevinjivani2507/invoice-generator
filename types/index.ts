export interface InvoiceItem {
  id: string;
  description: string;
  pieces: number;
  carats: number;
  price: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  from: Address;
  to: Address;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  bankDetails: BankDetails;
  currency: string;
}
