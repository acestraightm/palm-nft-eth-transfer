import { useCallback, useEffect, useState } from "react";
import { AppState } from "config/store";
import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { TAuthReducer } from "config/store/reducers/auth";
import { useRouter } from "next/router";

const Home: NextPage = ({}) => {
  const router = useRouter();

  const auth = useSelector<AppState, TAuthReducer>((state) => state.auth);
  useEffect(() => {
    if (!auth || !auth.token || !auth.email) {
      router.replace("/login");
      return;
    } else {
      router.replace("/wallet");
    }
  }, []);

  return (
    <div />
  );
};

export default Home;
