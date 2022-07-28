import { useState, useEffect } from "react";
import axios from "axios";
import useSession from "../hooks/useSession";
import { useRouter } from "next/router";

function Result() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState<any>({});
  const getUserData = async () => {
    setIsLoading(true);
    const user = await axios.post("/api/getUser", {
      token: localStorage.getItem("accesstoken"),
    });
    if (user.data.votes !== undefined) {
      setVotes(user.data.votes);
    } else {
      router.replace("/");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getUserData();
  }, []);

  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session === null) {
        localStorage.removeItem("accesstoken");
        router.replace("/login");
      }
    }
  }, [loading]);

  const handleOnLogoutClick = () => {
    localStorage.removeItem("accesstoken");
    router.replace("/login");
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-10 container mx-auto max-w-lg gap-4 px-6">
      <button
        className="bg-red-500 text-white w-fit px-4 py-2 rounded-lg self-end"
        onClick={handleOnLogoutClick}
      >
        ออกจากระบบ
      </button>
      <div className="bg-white border-2 px-10 py-4 rounded-lg  flex flex-col w-full">
        {isLoading ? (
          <h1>กำลังโหลด</h1>
        ) : (
          <>
            <h1 className="text-2xl self-center">เหล่าคณะกรรมการที่คุณโหวต</h1>
            <div className="mt-4">
              <h1 className="text-2xl my-4">เฮดภาค</h1>
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4 text-xl">
                  <input type="radio" name="head" checked readOnly />
                  <h4>{votes[0]}</h4>
                </div>
              </div>
              <h1 className="text-2xl my-4">รองเฮดภาค</h1>
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4 text-xl">
                  <input type="radio" name="second-head" checked readOnly />
                  <h4>{votes[1]}</h4>
                </div>
              </div>

              <h1 className="text-2xl my-4">เลขานุการ</h1>
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4 text-xl">
                  <input type="radio" name="secretary" checked readOnly />
                  <h4>{votes[2]}</h4>
                </div>
              </div>
              <h1 className="text-2xl my-4">เหรัญญิก</h1>
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4 text-xl">
                  <input type="radio" name="money" checked readOnly />
                  <h4>{votes[3]}</h4>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Result;
