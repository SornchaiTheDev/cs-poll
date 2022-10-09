import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useSession from "../hooks/useSession";
import { useRouter } from "next/router";
import axios from "axios";

const Home: NextPage = ({
  headPos,
  secondHeadPos,
  secretaryPos,
  moneyPos,
}: any) => {
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

  const handleOnAddPersonClick = () => {
    router.push("/addPerson");
  };

  const [head, setHead] = useState<string>("");
  const [secondHead, setSecondHead] = useState<string>("");
  const [secretary, setSecretary] = useState<string>("");
  const [money, setMoney] = useState<string>("");
  const [noVote, setNoVote] = useState<boolean>(false);

  const handleOnHeadClick = (e: any) => {
    setHead(e.target.value);
  };

  const handleOnSecondHeadClick = (e: any) => {
    setSecondHead(e.target.value);
  };

  const handleOnSecretaryClick = (e: any) => {
    setSecretary(e.target.value);
  };

  const handleOnMoneyClick = (e: any) => {
    setMoney(e.target.value);
  };

  const handleOnVote = async () => {
    if (
      (head === "" || secondHead === "" || secretary === "" || money === "") &&
      !noVote
    )
      return;

    try {
      const res = await axios.post("/api/vote", {
        head,
        secondHead,
        secretary,
        money,
        noVote,
        token: localStorage.getItem("accesstoken"),
      });

      if (res.data.status === "success") {
        alert("โหวตสำเร็จ");
        localStorage.clear();
        router.replace("/login");
      }
    } catch (err) {
      alert("คุณโหวตไปแล้ว!!!");
      localStorage.setItem("isVoted", "true");
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("isVoted") === "true") {
  //     router.replace("/result");
  //   }
  // }, []);

  const handleOnLogoutClick = () => {
    localStorage.removeItem("accesstoken");
    router.replace("/login");
  };

  const handleOnNoVoteClick = () => {
    setNoVote(!noVote);
  };

  if (loading) return <></>;

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-10 container mx-auto max-w-lg gap-4 px-6">
      <div className="flex w-full justify-end items-center gap-2">
        <button
          className="bg-lime-400 w-fit px-4 py-2 rounded-lg self-end"
          onClick={handleOnAddPersonClick}
        >
          เพิ่มชื่อตัวเอง
        </button>
        <button
          className="bg-red-500 text-white w-fit px-4 py-2 rounded-lg self-end"
          onClick={handleOnLogoutClick}
        >
          ออกจากระบบ
        </button>
      </div>
      <div className="bg-white border-2 px-10 py-4 rounded-lg  flex flex-col w-full">
        {loading ? (
          <h1>กำลังโหลด</h1>
        ) : (
          <>
            <h1 className="text-2xl self-center">โหวตคณะกรรมการ</h1>
            <div className="mt-4">
              <h1 className="text-2xl my-4">เฮดภาค</h1>
              <div className="flex flex-col gap-4" onChange={handleOnHeadClick}>
                {headPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="head" value={name + ":" + id} />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">รองเฮดภาค</h1>
              <div
                className="flex flex-col gap-4"
                onChange={handleOnSecondHeadClick}
              >
                {secondHeadPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input
                      type="radio"
                      name="second-head"
                      value={name + ":" + id}
                    />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>

              <h1 className="text-2xl my-4">เลขานุการ</h1>
              <div
                className="flex flex-col gap-4"
                onChange={handleOnSecretaryClick}
              >
                {secretaryPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input
                      type="radio"
                      name="secretary"
                      value={name + ":" + id}
                    />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">เหรัญญิก</h1>
              <div
                className="flex flex-col gap-4"
                onChange={handleOnMoneyClick}
              >
                {moneyPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="money" value={name + ":" + id} />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <div className="inline-flex gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={noVote}
                  id="novote"
                  onChange={handleOnNoVoteClick}
                />
                <label htmlFor="novote" className="text-lg">
                  ไม่ประสงค์ลงคะแนน
                </label>
              </div>
              <p className="text-red-500 mt-4">
                *โปรดมั่นใจก่อนเลือก เพราะเลือกได้ครั้งเดียวเท่านั้น !
              </p>
              <button
                onClick={handleOnVote}
                disabled={
                  (head === "" ||
                    secondHead === "" ||
                    secretary === "" ||
                    money === "") &&
                  !noVote
                }
                className="w-full p-2 bg-lime-400 disabled:bg-gray-200 rounded-lg my-4"
              >
                ส่ง
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import { store } from "../firebase/";
import { collection, query, getDocs } from "firebase/firestore";

export async function getServerSideProps(context: any) {
  const head = query(collection(store, "head"));
  const headPos: any[] = [];
  const queryHeadSnapshot = await getDocs(head);
  queryHeadSnapshot.forEach((doc) => {
    headPos.push({ id: doc.id, ...doc.data() });
  });

  const secondHead = query(collection(store, "second-head"));
  const secondHeadPos: any[] = [];
  const querysecondHeadSnapshot = await getDocs(secondHead);
  querysecondHeadSnapshot.forEach((doc) => {
    secondHeadPos.push({ id: doc.id, ...doc.data() });
  });

  const secretary = query(collection(store, "secretary"));
  const secretaryPos: any[] = [];
  const querySecretarySnapshot = await getDocs(secretary);
  querySecretarySnapshot.forEach((doc) => {
    secretaryPos.push({ id: doc.id, ...doc.data() });
  });

  const money = query(collection(store, "money"));
  const moneyPos: any[] = [];
  const queryMoneySnapshot = await getDocs(money);
  queryMoneySnapshot.forEach((doc) => {
    moneyPos.push({ id: doc.id, ...doc.data() });
  });

  return {
    props: {
      headPos,
      secondHeadPos,
      secretaryPos,
      moneyPos,
    },
  };
}
export default Home;
