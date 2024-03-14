import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import NoData from "@/components/NoData";
import TrustDonationModel from "@/components/TrustDonationModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL, TRUST_CATAGORY_OPTIONS } from "@/consts";
import { TrustData } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TrustDonation = () => {
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [trusts, setTrusts] = useState<TrustData[]>();
  const getAllTrust = async () => {
    fetch(`${BACKEND_BASE_URL}/api/allTrustsV`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTrusts(data.verifiedTrusts);
      });
  };

  useEffect(() => {
    getAllTrust();
  }, []);

  const offset = currentPage * itemsPerPage;

  const filteredUsers = trusts?.filter((user) => {
    const categoryMatches =
      selectedCategory === "" || user.category === selectedCategory;

    const containsSearchQuery = Object.values(user).some((value) => {
      if (typeof value === "object") {
        return Object.values(value).some((nestedValue) =>
          nestedValue
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      } else if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });

    return categoryMatches && containsSearchQuery;
  });

  const currentItems = filteredUsers?.slice(offset, offset + itemsPerPage);
  return (
    <>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Trust Donation</h1>
        <div className="w-full flex gap-3 mb-5 justify-between">
          <div className="w-full flex flex-col">
            <h1 className="text-lg font-bold mb-2">Text Search</h1>
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 w-full shadow-sm outline-none rounded p-2"
            />
          </div>
          <div className="w-1/4 flex flex-col">
            <label htmlFor="searchCategory" className="text-lg font-bold mb-2">
              Category Search
            </label>
            <select
              id="searchCategory"
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 cursor-pointer w-full shadow-sm outline-none rounded p-2"
            >
              {TRUST_CATAGORY_OPTIONS &&
                TRUST_CATAGORY_OPTIONS.length &&
                TRUST_CATAGORY_OPTIONS.map(({ id, option }, index) => {
                  return (
                    <option
                      key={index}
                      className="cursor-pointer"
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center">
          {currentItems &&
            currentItems.length > 0 &&
            currentItems.map((trust, index) => {
              return <TrustDonationModel key={index} trust={trust} />;
            })}
        </div>
        {!currentItems?.length && <NoData />}
      </div>
    </>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(TrustDonation);
