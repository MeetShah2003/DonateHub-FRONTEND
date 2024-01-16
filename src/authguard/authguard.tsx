import type { GetServerSideProps } from "next";

export const getNotAuthenticatedRouteCheck: GetServerSideProps = async (
  contex
) => {
  const accessToken = contex.req.cookies?.access_token;
  if (accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return { props: {} };
};

export const getAuthenticatedRouteCheck: GetServerSideProps = async (
  contex
) => {
  const accessToken = contex?.req?.cookies?.access_token || "";

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: {} };
};
