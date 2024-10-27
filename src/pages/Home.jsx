import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { db } from "../Firebase";
import { orderBy, collection, query, limit, getDocs } from "firebase/firestore";
import Spinner from "../components/Spinner";

export default function Home() {

  return (
    <div>
      <Slider />
    </div>
  );
}
