export type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
};

export type TrustData = {
  trustId: string;
  trustname: string;
  trustlogo: string;
  trustemail: string;
  founder: string;
  creationdate: Date;
  catagory: string;
  contactno: number;
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
