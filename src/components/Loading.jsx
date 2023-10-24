import React from "react";
import { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";

const Loading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      {loading ? (
        <BarLoader color={"#EFA73E"} loading={loading} size={30} />
      ) : (
        <div>Hello World</div>
      )}
    </div>
  );
};

export default Loading;
