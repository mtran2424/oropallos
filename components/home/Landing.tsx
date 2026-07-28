"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);

  return (<></>);
}

export default Landing;