import AdminFrame from "@/components/AdminFrame";
import { BACKEND_BASE_URL } from "@/consts";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/router";

const SingleTrust = () => {
  const { query } = useRouter();
  const { token } = useAuth();

  const onAccept = async () => {
    fetch(`${BACKEND_BASE_URL}/admin/acceptStatus/${query.trustId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };
  const onReject = () => {
    fetch(`${BACKEND_BASE_URL}/admin/rejectStatus/${query.trustId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <AdminFrame title="Trust Details">
      <>
        <button
          onClick={() => {
            onReject();
          }}
        >
          Reject
        </button>
        <button
          onClick={() => {
            onAccept();
          }}
        >
          Accept
        </button>
      </>
    </AdminFrame>
  );
};

export default SingleTrust;
