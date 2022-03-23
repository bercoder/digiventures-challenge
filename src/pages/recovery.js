import { useEffect } from "react";

export default function Recovery() {

  useEffect(() => {
    async function revalidate() {
      const res = await fetch("/api/revalidate?secret=tokendelchallenge");
      console.log(res)
    }

    revalidate();

  }, []);

  return <p>Recovering...</p>
}