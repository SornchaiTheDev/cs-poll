import type { NextPage } from "next/types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const Login = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/login", {
        username,
        password,
      });

      const { accesstoken, user } = res.data;

      const { data }: any = await axios.post("/api/getUser", {
        token: accesstoken,
      });

      if (data.canVote) {
        localStorage.setItem("accesstoken", accesstoken);
        localStorage.setItem("firstName", user.firstNameTh);
        router.replace("/");
      } else {
        setError("คุณโหวตไปแล้ว!!!");
        setIsLoading(false);
      }
    } catch (err) {
      setError("เลขประจำตัว หรือ รหัสผ่านผิด");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-white border-2 px-10 py-4 rounded-lg w-3/4 md:w-4/12 flex flex-col items-center">
        <h2 className="font-bold text-lg my-4">ล็อคอินด้วย Nontri Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <button
          className="bg-lime-400 w-full p-2 rounded-lg flex justify-center items-center h-12"
          onClick={Login}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <p>ล็อคอิน</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
