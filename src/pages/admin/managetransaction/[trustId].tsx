import { useRouter } from "next/router";

const SingleTrustTransaction = () => {
  const router = useRouter();
  return <div>{router.query.trustId}</div>;
};

export default SingleTrustTransaction;
