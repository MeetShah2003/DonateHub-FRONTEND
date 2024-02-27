import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import NoData from "@/components/NoData";
import TrustModel from "@/components/TrustModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL, TRUST_CATAGORY_OPTIONS } from "@/consts";
import { FundRequirement, TrustData } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [fundRequirement, setFundRequirement] = useState<FundRequirement[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const getAllTrust = async () => {
    fetch(`${BACKEND_BASE_URL}/api/fundRequest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res: any) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setFundRequirement(data.fundRequirement);
      });
  };

  useEffect(() => {
    getAllTrust();
  }, []);

  const offset = currentPage * itemsPerPage;

  const filteredUsers = fundRequirement?.filter((user) => {
    const categoryMatches =
      selectedCategory === "" || user.tId.category === selectedCategory;

    // Convert all object values to strings and search across all fields
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

  console.log(currentItems);

  return (
    <>
      <Visitor />
      <div className="max-w-screen-lg w-90% mx-auto">
        <h1 className="my-5 text-2xl font-semibold">Home Page</h1>
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
          <div className="w-1/4 flex flex-col cu">
            <label htmlFor="searchCategory" className="text-lg font-bold mb-2">
              Category Search
            </label>
            <select
              id="searchCategory"
              // value={searchQuery}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 cursor-pointer w-full shadow-sm outline-none rounded p-2"
            >
              {TRUST_CATAGORY_OPTIONS &&
                TRUST_CATAGORY_OPTIONS.length &&
                TRUST_CATAGORY_OPTIONS.map(({ id, option }) => {
                  return (
                    <option
                      key={id}
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

        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center items-center">
          {currentItems &&
            currentItems.length > 0 &&
            currentItems.map(({ tId, _id, targetFund, title }) => {
              return (
                <TrustModel
                  key={_id}
                  title={title}
                  trustlogo={tId.trustlogo}
                  trustId={_id}
                  donationRaised={tId.TotalAmount}
                  donationTarget={targetFund}
                  supporters={502}
                  type="fundrequest"
                />
              );
            })}
        </div>
        {!currentItems?.length && <NoData />}
      </div>
    </>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(Dashboard);
