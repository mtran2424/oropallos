"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Landing = () => {

  useEffect(() => {
    redirect("/home");
  }, []);

  return (<></>);
}

export default Landing;