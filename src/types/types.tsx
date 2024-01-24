export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
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
  address: {
    address: string;
    city: string;
    state: string;
    pincode: number;
  };
  role: string;
};
