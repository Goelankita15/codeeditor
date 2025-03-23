"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const createARoom = () => {
    const number = Math.floor(Math.random() * 1000);
    router.push(`/room/${number}`);
    console.log("Creating a room");
  };
  const JoinRoom = () => {
    console.log("Joining a room");
  }
  return (

    <div>
        <button onClick={createARoom}>Create room</button>
        <br/>
        <button onClick={JoinRoom}>Join room</button>
    </div>
  );
}
