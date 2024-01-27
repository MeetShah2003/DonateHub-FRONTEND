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
  id: string;
  trustName: string;
  trustlogo: string;
  email: string;
  founder: string;
  creationdate: Date;
  category: string;
  contactNo: number;
  abouttrust: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  role: "trust";
};
