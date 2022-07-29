import Head from "next/head";
import styles from "~/styles/Home.module.css";
import Curves from "~/components/graphs/Curves";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const graphRef = useRef();
  const [graphSize, setGraphSize] = useState({ w: 0, h: 300 });
  const [timeoutID, setTimeoutID] = useState(null);

  const onResize = () => {
    if (timeoutID == null) {
      setTimeoutID(
        setTimeout(() => {
          setGraphSize({ w: graphRef.current.clientWidth, h: graphSize.h });
          clearTimeout(timeoutID);
          setTimeoutID(null);
        }, 500)
      );
    }
  };

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [graphSize]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login to the app</h1>

        <div ref={graphRef} className="col-12 p-0">
          <Curves
            height={graphSize.h}
            width={graphSize.w}
            style={{ backgroundColor: "#cccc" }}
          />
        </div>
      </main>
    </div>
  );
}
