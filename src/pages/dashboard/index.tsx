import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import NoData from "@/components/NoData";
import Spinner from "@/components/Spinner";
import TrustModel from "@/components/TrustModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL, TRUST_CATAGORY_OPTIONS } from "@/consts";
import { FundRequirement } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fundRequirement, setFundRequirement] = useState<FundRequirement[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const getAllTrust = async () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/api/fundRequest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFundRequirement(data.allTrust);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllTrust();
  }, []);

  const offset = currentPage * itemsPerPage;

  const filteredUsers = fundRequirement?.filter((user) => {
    const categoryMatches =
      selectedCategory === "" || user.tId?.category === selectedCategory;

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
        <h1 className="my-5 text-2xl font-semibold">Home Page</h1>
        <div className="w-full flex flex-col md:flex-row gap-3 mb-5 justify-between">
          <div className="w-full flex flex-col">
            <h1 className="text-lg font-bold mb-2">Search</h1>
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 w-full shadow-sm outline-none rounded p-2"
            />
          </div>
          <div className="w-full md:w-1/4 flex flex-col">
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
            currentItems.map(
              ({
                tId,
                title,
                targetFund,
                nUniqueSupporters,
                _id,
                recievedFund,
              }) => {
                console.log(currentItems);
                return (
                  <>
                    <TrustModel
                      key={tId?._id}
                      title={title as string}
                      trustlogo={tId?.trustlogo as string}
                      trustId={_id as string}
                      donationRaised={recievedFund || 0}
                      donationTarget={targetFund || 0}
                      supporters={nUniqueSupporters || 0}
                      type="fundrequest"
                    />
                  </>
                );
              }
            )}
        </div>
        {!currentItems?.length && !loading && <NoData />}
        {loading && <Spinner />}
      </div>
    </>
  );
};

export const getServerSideProps = getAuthenticatedRouteCheck;
export default UserRoute(Dashboard);
