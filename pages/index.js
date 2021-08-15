import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "x-token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJlY2o0bHdRTUpJNUYxM3RyIiwiZW1haWwiOiJhZG1pbkB0YWxrYm94YXBwLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJHVtM0M3ZlZGUXVwWS9NNHozb05EcmVEa1FVMzFCQS50SlhxTmp0dzNXYUJCMHRuUUJuQzRLIiwic3RhdHVzIjoiYXBwcm92ZWQiLCJkaXNwbGF5TmFtZSI6InRlc3RpbmciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MjkwNDc2Njl9.PeyezBVFSSLn53OOdz1tMjAIlpZGjsy6xh82I1kcujU"
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: "admin@talkboxapp.com",
      password: "1234567",
    });

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    axios
      .get(
        "https://on-board-task-49gse3cpk-timay-talkbox.vercel.app//api/admin/user/list?size=4&page=1",
        requestOptions
      )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
