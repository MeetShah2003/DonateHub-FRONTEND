export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
  isBlocked: boolean;
  role: "user";
};

export type TrustData = {
  _id?: string;
  trustName: string;
  trustlogo: string;
  email: string;
  founder: string;
  creationDate: Date;
  category: string;
  contactNo: string;
  description: string;
  password?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role?: "trust";
  isBlocked?: boolean;
  isVerified?: boolean;
  TotalAmount?: number;
};
