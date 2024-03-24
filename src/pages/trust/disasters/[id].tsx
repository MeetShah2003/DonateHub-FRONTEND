import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const DisasterTransaction = () => {
  const [loading, setLoading] = useState(false);
  const access_token = Cookies.get("access_token");
  const { query } = useRouter();
  const getTransaction = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/allTransactions/${query.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => {
        if (res && res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log(data);
        }
      });
  };

  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <TrustNavbar title="Disaster Transaction">
      <div></div>
    </TrustNavbar>
  );
};
export default TrustRoute(DisasterTransaction);
