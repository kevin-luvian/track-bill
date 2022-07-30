import Head from "next/head";
import styles from "~/styles/Home.module.css";
import Curves, { AdjCurves } from "~/components/graphs/Curves";
import { useEffect, useRef, useState } from "react";
import GrCard from "~/components/cards/GrCard";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <main>
        <h1>Login to the app</h1>

        <AdjCurves
          className="h-100"
          style={{ height: "200px" }}
          bgcolor="rgb(255,131,0)"
        />

        <div className="divider" />

        <GrCard />
      </main>
    </div>
  );
}
