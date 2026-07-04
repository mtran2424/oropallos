"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Landing = () => {

  useEffect(() => {
    redirect("/home");
  }, []);

  return (<></>);
}

export default Landing;