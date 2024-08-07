import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/entrar");
  }, []);

  return (
    <>
      <Head>
        <title>{process.env.title}</title>
      </Head>
    </>
  );
}