import ErrorPage from "../components/NotFound";
import { useEffect } from "react";
import { useRouter } from "next//router";
import Head from "next/head";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  return (
    <>
      <Head>
        <title>404 Not Found</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/c.png" />
      </Head>
      <ErrorPage msg="Oops! Sorry we cannot find the page" />
    </>
  );
};

export default NotFound;
