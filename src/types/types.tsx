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
  manualDonation?: number;
  naturalSupporter?: string[];
  nUniqueSupporters?: number;
};

export type FundRequirement = {
  trust: TrustData;
  fundRequest: {
    targetFund: number;
    title: string;
    description: string;
    altContact: 8520369741;
    _id: string;
  };
};

export type SingleFundRequirement = {
  _id: string;
  tId: {
    _id: string;
    trustlogo: string;
    trustName: string;
    email: string;
    password: string;
    description: string;
    category: string;
    creationDate: string;
    founder: string;
    contactNo: number;
    address: string;
    state: string;
    city: string;
    pincode: number;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    TotalAmount: number;
    __v: number;
    manualDonation: number;
    naturalSupporter: string[];
    nUniqueSupporters: number;
  };
  targetFund: number;
  startDate: Date;
  endDate: Date;
  title: string;
  description: string;
  altContact: number;
  __v: number;
};

export type RequestFunds = {
  _id: string;
  tId: string;
  uId: string;
  title: string;
  description: string;
  reqAmount: number;
  documents: string[];
  transactionDate: Date;
  isAccepted: boolean;
  isRejected: boolean;
  __v?: number;
};

export type ContactUsType = {
  name: string;
  email: string;
  contactNo: number;
  subject: string;
  message: string;
};
