import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";
import { BACKEND_BASE_URL } from "@/consts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TransactionTrustsModel from "@/components/TransactionTrustsModel";
import { DisasterForTrust } from "@/types/types";
import { useRouter } from "next/router";

const Disaters = () => {
  const [loading, setLoading] = useState(false);
  const [disasters, setDisasters] = useState<DisasterForTrust>();
  const access_token = Cookies.get("access_token");
  const { push } = useRouter();
  const disastersCount = () => {
    setLoading(true);
    fetch(`${BACKEND_BASE_URL}/trust/myDisaster`, {
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
      .then((data: any) => {
        if (data) {
          console.log(data);
          setDisasters(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    disastersCount();
  }, []);

  console.log(disasters);
  return (
    <TrustNavbar title="Disaters">
      <div className="flex flex-col gap-2">
        {disasters &&
          disasters.myDisasters.length &&
          disasters.myDisasters.map(
            ({
              title,
              description,
              disasterImage,
              tId,
              recievedFund,
              _id,
              status,
            }) => {
              return (
                <TransactionTrustsModel
                  key={1}
                  title={title}
                  description={description}
                  trustImage={disasterImage}
                  founder={tId.founder}
                  statusOfModel={status}
                  creationDate={tId.creationDate}
                  amount={recievedFund}
                  onShowTransaction={() => {
                    push(`/trust/disasters/${_id}`);
                  }}
                  onEditDisaster={() => {
                    push(`/trust/${_id}`);
                  }}
                />
              );
            }
          )}
      </div>
    </TrustNavbar>
  );
};

export default TrustRoute(Disaters);
