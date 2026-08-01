import { getAuthenticatedRouteCheck } from "@/authguard/authguard";
import NoData from "@/components/NoData";
import Spinner from "@/components/Spinner";
import TrustModel from "@/components/TrustModel";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";
import { BACKEND_BASE_URL, MAX_LENGTH, TRUST_CATAGORY_OPTIONS } from "@/consts";
import { FundRequirement } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const access_token = Cookies.get("access_token");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const { inputLength } = MAX_LENGTH;
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
      <div className="mx-auto max-w-7xl w-[90%] py-8 md:py-10">
        <div className="mb-6 rounded-[30px] bg-gradient-to-r from-violet-700 via-primary to-fuchsia-600 p-[1px] shadow-[0_25px_70px_-30px_rgba(109,40,217,0.7)]">
          <div className="rounded-[29px] bg-white/95 px-5 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  Explore campaigns
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Home Page</h1>
              </div>
              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-primary">
                {fundRequirement?.length || 0} active campaigns
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.3fr_0.7fr]">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-700">Search</label>
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              maxLength={inputLength}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:bg-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="searchCategory" className="mb-2 text-sm font-semibold text-slate-700">
              Category Search
            </label>
            <select
              id="searchCategory"
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:bg-white"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-center items-stretch">
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
                disasterImage,
              }) => {
                return (
                  <>
                    <TrustModel
                      key={tId?._id}
                      title={title as string}
                      trustlogo={disasterImage as string}
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
