export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
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
