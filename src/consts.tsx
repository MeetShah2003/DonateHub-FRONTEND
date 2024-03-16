export const TRUST_CATAGORY_OPTIONS: {
  id: number;
  option: { value: string; label: string };
}[] = [
  { id: 1, option: { label: "Select Catagory", value: "" } },
  { id: 2, option: { label: "Education", value: "education" } },
  { id: 3, option: { label: "Healthcare", value: "healthcare" } },
  { id: 4, option: { label: "Technology", value: "technology" } },
  { id: 5, option: { label: "Food", value: "food" } },
  { id: 6, option: { label: "Financial", value: "financial" } },
  { id: 6, option: { label: "Clothing", value: "clothing" } },
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
      { label: "Pune", value: "pune" },
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

export const FRONTEND_BASE_URL = "http://localhost:3000";
export const BACKEND_BASE_URL = "http://localhost:8090";

// export const FRONTEND_BASE_URL = "https://donatehub.vercel.app/";
// export const BACKEND_BASE_URL = "https://silly-overalls-toad.cyclic.app";
// export const BACKEND_BASE_URL = "https://donatehub.onrender.com";dashboard/trustdonation
