"use client";
import dynamic from "next/dynamic";
const FileDropDynamic = dynamic(() => import("@/components/FileDrop"), {
  ssr: false,
});
export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col justify-center items-center p-24">
        <FileDropDynamic onDrop={console.log} />
      </main>
    </>
  );
}
