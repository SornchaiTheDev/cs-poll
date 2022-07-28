import type { NextPage } from "next/types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const Login = async () => {
    try {
      const res = await axios.post("/api/login", {
        username,
        password,
      });
      const { accesstoken } = res.data;
      localStorage.setItem("accesstoken", accesstoken);
      router.push("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-white border-2 px-10 py-4 rounded-lg w-3/4 md:w-4/12 flex flex-col items-center">
        <h2 className="font-bold text-lg">ล็อคอินด้วย Nontri Account</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          placeholder="b651xxxxxxx"
          className="border-2 rounded-lg p-2 my-2 w-full"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-2 rounded-lg p-2 my-2 w-full"
        />
        <button className="bg-lime-400 w-full p-2 rounded-lg" onClick={Login}>
          ล็อคอิน
        </button>
      </div>
    </div>
  );
};

export default Login;
