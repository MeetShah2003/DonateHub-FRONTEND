export type UserData = {
  _id: string;
  userlogo: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
  isBlocked: boolean;
  role: "user";
  mono: number;
  createdAt: Date;
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
  _id: string;
  tId: TrustData;
  disasterImage: string;
  targetFund: number;
  startDate: Date;
  recievedFund: number;
  title: string;
  description: string;
  altContact: number;
  nUniqueSupporters: number;
  naturalSupporter: [];
  status: string;
  defaultDate: Date;
};

export type SingleFundRequirement = {
  _id?: string;
  tId: TrustData;
  disasterImage: string;
  targetFund: number;
  startDate: Date;
  recievedFund: number;
  title: string;
  description: string;
  altContact: number | undefined;
  naturalSupporter: string[];
  nUniqueSupporters: 2;
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
  _id?: string;
  uId?: UserData;
  name: string;
  email: string;
  contactNo: number | null;
  subject: string;
  message: string;
};

export type ReviewType = {
  _id: string;
  uId: UserData;
  tId: string;
  reviewText: string;
  createdAt: Date;
  likes: number;
  disLikes: number;
  helpfullCount: number;
  helpfullUsers: [];
  notHelpfullCount: number;
  notHelpfullUsers: [];
  isVerified: boolean;
  __v: 7;
  disLikedBy: string[];
  likedBy: string[];
};

export type TrustWiseTransaction = {
  allTrust: [
    {
      status: string;
      defaultDate: Date;
      _id: string;
      tId: TrustData;
      disasterImage: string;
      targetFund: number;
      startDate: Date;
      recievedFund: number;
      title: string;
      description: string;
      altContact: number;
      naturalSupporter: string[];
      nUniqueSupporters: number;
    }
  ];
  receiveFund: number;
};

export type SingleTrustTransaction = {
  _id: string;
  paymentId: string;
  tId?: TrustData;
  uId: UserData;
  donatedAmount: number;
  manualDonatedAmount?: number;
  transactionDate: Date;
};

export type SuccessTransaction = {
  userTransaction: {
    paymentId: string;
    tId: string;
    uId: string;
    donatedAmount: number;
    transactionDate: Date;
    _id: string;
  };
  tData: SingleFundRequirement;
};

export type SuccessTrustDonationTransaction = {
  paymentId: string;
  tId: string;
  uId: string;
  manualDonatedAmount: number;
  transactionDate: Date;
  _id: string;
};

export type NormalTransactionForTrust = {
  myIncome: number;
  uniqueSupporters: number;
  myTransactions: {
    _id: string;
    paymentId: string;
    tId: TrustData;
    uId: {
      defaultDate: string;
      _id: string;
      userlogo: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      gender: string;
      mono: number;
      role: string;
      isBlocked: boolean;
      createdAt: Date;
      emergencyFund: number;
    };
    manualDonatedAmount: number;
    transactionDate: Date;
    defaultDate: Date;
  }[];
};

export type DisasterForTrust = {
  myDisasters: {
    _id: string;
    tId: TrustData;
    disasterImage: string;
    targetFund: number;
    startDate: Date;
    recievedFund: number;
    title: string;
    description: string;
    altContact: number;
    nUniqueSupporters: number;
    naturalSupporter: string[];
    status: string;
    defaultDate: Date;
  }[];
  countDisaster: number;
};

export type SingleDisaster = {
  _id: string;
  tId: string;
  disasterImage: string;
  targetFund: number;
  startDate: string;
  receivedFund: number;
  title: string;
  description: string;
  altContact: number;
  nUniqueSupporters: number;
  naturalSupporter: string[];
  status: string;
  defaultDate: string;
};
