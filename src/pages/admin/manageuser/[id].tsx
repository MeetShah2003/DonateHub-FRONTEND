import AdminFrame from "@/components/AdminFrame";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BACKEND_BASE_URL } from "@/consts";
import { UserData } from "@/types/types";
import AdminRoute from "@/components/AdminRoute";
import Spinner from "@/components/Spinner";

const SingleUser = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const [userData, setUserData] = useState<UserData>();

  const getSingleUser = (id: string) => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/admin/singleUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.singlePageUser);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSingleUser(query?.id as string);
  }, [access_token]);

  return (
    <AdminFrame title="User Detail">
      {loading && <Spinner />}
      <div className="w-full flex flex-col border gap-1">
        <div className="bg-secondary flex justify-center items-center py-5">
          <Image
            className="h-28 w-28 rounded-md"
            alt={"user Image"}
            src={userData?.userlogo as string}
            width={100}
            height={500}
          />
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full md:w-1/2 bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Firstname
            </h1>
            <h1 className="pb-1 text-sm font-medium">{userData?.firstName}</h1>
          </div>
          <div className="w-full md:w-1/2 bg-secondary md:bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Lastname
            </h1>
            <h1 className="pb-1 text-sm font-medium">{userData?.lastName}</h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-primaryLight md:bg-secondary p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Email
            </h1>
            <h1 className="pb-1 text-sm font-medium">{userData?.email}</h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-secondary md:bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Gender
            </h1>
            <h1 className="pb-1 text-sm font-medium">{userData?.gender}</h1>
          </div>
        </div>
        <div className=" flex flex-col gap-1 md:flex-row ">
          <div className="w-full bg-primaryLight md:bg-secondary p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Mobile No
            </h1>
            <h1 className="pb-1 text-sm font-medium">{userData?.mono}</h1>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:flex-row">
          <div className="w-full bg-secondary md:bg-primaryLight p-2">
            <h1 className="pb-1 text-sm tracking-wider text-gray-500 font-medium">
              Creation Date & Time
            </h1>
            {userData && (
              <h1 className="pb-1 text-sm font-medium">
                {new Date(userData.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </h1>
            )}
          </div>
        </div>
      </div>
    </AdminFrame>
  );
};

export default AdminRoute(SingleUser);
