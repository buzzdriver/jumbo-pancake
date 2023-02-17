import React, { useEffect } from "react";

import Router from "next/router";

import Layout from "../common/components/Layout";

export default function Home() {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname === "/") {
      Router.push("/vaults");
    }
  });
  return <Layout title="Home" />;
}
