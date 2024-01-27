export const TRUST_CATAGORY_OPTIONS: {
  id: number;
  option: { value: string; label: string };
}[] = [
  { id: 1, option: { label: "Select Catagory", value: "" } },
  { id: 2, option: { label: "Education", value: "education" } },
  { id: 3, option: { label: "healthcare", value: "healthcare" } },
  { id: 4, option: { label: "technology", value: "technology" } },
  { id: 5, option: { label: "food", value: "food" } },
  { id: 6, option: { label: "financial", value: "financial" } },
  { id: 6, option: { label: "clothing", value: "clothing" } },
];

// export const CITY: {
//   id: number;
//   city: { value: string; label: string };
// }[] = [
//   { id: 1, city: { label: "Surat", value: "surat" } },
//   { id: 2, city: { label: "Vadodra", value: "vadodra" } },
//   { id: 3, city: { label: "Ahmedabad", value: "ahmedabad" } },
//   { id: 4, city: { label: "Rajkot", value: "rajkot" } },
// ];

export const CITY_AND_STATE: {
  id: number;
  state: { value: string; label: string };
  city: { value: string; label: string }[];
}[] = [
  {
    id: 1,
    state: { label: "Select State", value: "" },
    city: [{ label: "Select City", value: "" }],
  },
  {
    id: 2,
    state: { label: "Gujrat", value: "gujrat" },
    city: [
      { label: "Surat", value: "surat" },
      { label: "Vadodra", value: "vadodra" },
      { label: "Ahmedabad", value: "ahmedabad" },
      { label: "Rajkot", value: "rajkot" },
    ],
  },
  {
    id: 3,
    state: { label: "Maharashtra", value: "maharashtra" },
    city: [
      { label: "Mumbai", value: "mumbai" },
      { label: "Pune", value: "Pune" },
      { label: "Nashik", value: "nashik" },
    ],
  },
  {
    id: 4,
    state: { label: "Karnatak", value: "karnatak" },
    city: [
      { label: "Bangalore", value: "bangalore" },
      { label: "Mysuru", value: "mysuru" },
      { label: "Hubballi", value: "hubballi" },
      { label: "Mangaluru", value: "mangaluru" },
    ],
  },
];

export const dummyUsers: {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  id: string;
}[][] = [
  [
    {
      firstName: "Haley",
      lastName: "Garcia",
      email: "h_l15@gmail.com",
      gender: "F",
      id: "5",
    },
    {
      firstName: "Amanda",
      lastName: "Martin",
      email: "ammartin97@outlook.com",
      gender: "F",
      id: "9",
    },
    {
      firstName: "Jeremy",
      lastName: "Young",
      email: "j_c_young37@ymail.com",
      gender: "M",
      id: "6",
    },
    {
      firstName: "Michelle",
      lastName: "Long",
      email: "michelle.long61@yahoo.com",
      gender: "F",
      id: "3",
    },
    {
      firstName: "Brianna",
      lastName: "Hall",
      email: "brianna.hall@aol.com",
      gender: "F",
      id: "3",
    },
    {
      firstName: "Ryan",
      lastName: "Hill",
      email: "ryanjhill41@yahoo.com",
      gender: "M",
      id: "4",
    },
    {
      firstName: "Claire",
      lastName: "Scott",
      email: "cescott@aol.com",
      gender: "F",
      id: "8",
    },
    {
      firstName: "Isabella",
      lastName: "Adams",
      email: "isabella_sue@gmail.com",
      gender: "F",
      id: "0",
    },
    {
      firstName: "Zachary",
      lastName: "Richardson",
      email: "zachary.edward.richardson32@ymail.com",
      gender: "M",
      id: "3",
    },
    {
      firstName: "Stephen",
      lastName: "Adams",
      email: "s_r_adams@hotmail.com",
      gender: "M",
      id: "7",
    },
    {
      firstName: "Theodore",
      lastName: "Gonzales",
      email: "theodore.gonzales@rocketmail.com",
      gender: "M",
      id: "6",
    },
    {
      firstName: "Tyler",
      lastName: "Henderson",
      email: "tyler_m_henderson@live.com",
      gender: "M",
      id: "6",
    },
    {
      firstName: "Layla",
      lastName: "Stewart",
      email: "layla_j_stewart@hotmail.com",
      gender: "F",
      id: "7",
    },
    {
      firstName: "Zachary",
      lastName: "Wright",
      email: "zachary_wright@live.com",
      gender: "M",
      id: "3",
    },
    {
      firstName: "Aubrey",
      lastName: "Collins",
      email: "aubreymcollins@hotmail.com",
      gender: "F",
      id: "8",
    },
    {
      firstName: "Courtney",
      lastName: "Lee",
      email: "c_lee3@rocketmail.com",
      gender: "F",
      id: "8",
    },
    {
      firstName: "Jessica",
      lastName: "Martin",
      email: "j_l_martin@aol.com",
      gender: "F",
      id: "1",
    },
    {
      firstName: "Allison",
      lastName: "Kelly",
      email: "allison_kelly@outlook.com",
      gender: "F",
      id: "2",
    },
    {
      firstName: "Aiden",
      lastName: "Reed",
      email: "aidenanthonyreed90@yahoo.com",
      gender: "M",
      id: "0",
    },
    {
      firstName: "Nathan",
      lastName: "Allen",
      email: "nallen@outlook.com",
      gender: "M",
      id: "0",
    },
    {
      firstName: "Olivia",
      lastName: "Gray",
      email: "oliviakgray@hotmail.com",
      gender: "F",
      id: "1",
    },
    {
      firstName: "Jason",
      lastName: "Diaz",
      email: "j.w.diaz43@live.com",
      gender: "M",
      id: "9",
    },
    {
      firstName: "Brian",
      lastName: "Collins",
      email: "brcollins@outlook.com",
      gender: "M",
      id: "1",
    },
  ],
];

export const trustData = [
  {
    trustName: "Haley",
    conatctNo: "212-365-8352",
    trustEmail: "h_l15@gmail.com",
    categoty: "Activity",
    id: "1",
  },
  {
    trustName: "Amanda",
    conatctNo: "703-750-5249",
    trustEmail: "ammartin97@outlook.com",
    categoty: "Health",
    id: "2",
  },
  {
    trustName: "Jeremy",
    conatctNo: "585-566-8594",
    trustEmail: "j_c_young37@ymail.com",
    categoty: "Activity",
    id: "3",
  },
  {
    trustName: "Michelle",
    conatctNo: "760-733-9909",
    trustEmail: "michelle.long61@yahoo.com",
    categoty: "Entertainment",
    id: "4",
  },
  {
    trustName: "Brianna",
    conatctNo: "248-800-7610",
    trustEmail: "brianna.hall@aol.com",
    categoty: "Home",
    id: "5",
  },
  {
    trustName: "Ryan",
    conatctNo: "812-335-0236",
    trustEmail: "ryanjhill41@yahoo.com",
    categoty: "Health",
    id: "6",
  },
  {
    trustName: "Claire",
    conatctNo: "817-518-4368",
    trustEmail: "cescott@aol.com",
    categoty: "Home",
    id: "7",
  },
  {
    trustName: "Isabella",
    conatctNo: "617-498-2357",
    trustEmail: "isabella_sue@gmail.com",
    categoty: "Clothing",
    id: "8",
  },
  {
    trustName: "Zachary",
    conatctNo: "331-680-1953",
    trustEmail: "zachary.edward.richardson32@ymail.com",
    categoty: "Home",
    id: "9",
  },
  {
    trustName: "Stephen",
    conatctNo: "432-844-0013",
    trustEmail: "s_r_adams@hotmail.com",
    categoty: "Electronics",
    id: "10",
  },
];

export const FRONTEND_BASE_URL = "http://localhost:3000";
export const BACKEND_BASE_URL = "http://localhost:8090";
