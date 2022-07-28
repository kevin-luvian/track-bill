import Head from "next/head";
import styles from "~/styles/Home.module.css";
import Canvas from "~/components/Canvas";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login to the app</h1>

        <Canvas height={500} width={800} style={{ backgroundColor: "#cccc" }} />
      </main>
    </div>
  );
}
