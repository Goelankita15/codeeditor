"use client";
import { getSocket } from "@/app/getsocket";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";

export default function Page() {  
    const { roomid } = useParams();
    const [code, setCode] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {   
        if (!roomid) return; // Prevent errors if roomid is undefined initially

        if (!socketRef.current) {
            socketRef.current = getSocket();
        }
        const socket = socketRef.current;

        console.log("Room ID:", roomid);
        
        socket.emit("join-room", { roomid });

        socket.on("joined user", (data) => {    
            console.log("User joined:", data);
        });

        socket.on("code recieved", (data) => {
            console.log("Code received:", data);
            setCode(data.code);
        });

        return () => {
            socket.off("joined user");
            socket.off("code recieved");
        };
    }, [roomid]);

    const handleCodechange = (newCode) => {     
        setCode(newCode);
        console.log("Code change:", newCode);

        if (socketRef.current) {
            socketRef.current.emit("code-change", { code: newCode, roomid });
        }
    };

    return (
        <div>
            <h1>Room {roomid}</h1>
            <Editor 
                height="90vh" 
                defaultLanguage="cpp" 
                defaultValue="// Write your code here"
                theme="vs-dark"
                value={code}
                onChange={handleCodechange}    
            />
        </div>
    );
}
