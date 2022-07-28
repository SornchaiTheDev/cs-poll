import type { NextPage } from "next";
import { useState, useEffect } from "react";
import useSession from "../hooks/useSession";
import { useRouter } from "next/router";
import axios from "axios";

const Home: NextPage = ({
  headPos,
  secondheadMalePos,
  secondheadFemalePos,
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

  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string | null>(null);
  const [isErr, setIsErr] = useState<boolean>(false);

  const addPerson = async () => {
    if (position === null) return;

    const res = await axios.post("/api/addPerson", {
      name,
      position,
      token: localStorage.getItem("accesstoken"),
    });
    const { status } = res.data;
    if (status === "success") {
      router.reload();
    } else {
      setIsErr(true);
      setName("");
    }
  };

  const handleOnRadioChange = (e: any) => {
    setPosition(e.target.value);
  };

  if (loading) return <></>;

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-white border-2 px-10 py-4 rounded-lg w-11/12 md:w-1/2 flex flex-col ">
        {loading ? (
          <h1>กำลังโหลด</h1>
        ) : (
          <>
            <h1 className="text-2xl self-center">โหวตคณะกรรมการ</h1>
            <div className="mt-4">
              <h1 className="text-2xl my-4">เฮดภาค</h1>
              <div className="flex flex-col gap-4">
                {headPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="head" />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">รองเฮดภาค อันดับ 1</h1>
              <div className="flex flex-col gap-4">
                {secondheadMalePos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="second-head-male" />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">รองเฮดภาค อันดับ 2</h1>
              <div className="flex flex-col gap-4">
                {secondheadFemalePos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="second-head-female" />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">เลขานุการ</h1>
              <div className="flex flex-col gap-4">
                {secretaryPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="secretary" />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">เหรัญญิก</h1>
              <div className="flex flex-col gap-4">
                {moneyPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="money" />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>

              <h2 className="text-lg mt-4 ">
                เสนอชื่อเพิ่มเติม (เหลือ 1 ครั้ง)
              </h2>
              <div onChange={handleOnRadioChange}>
                <div className="inline-flex items-center gap-4">
                  <input type="radio" name="custom" value="head" />{" "}
                  <label>เฮดภาค</label>
                </div>
                <div className="inline-flex items-center gap-4 ml-2">
                  <input type="radio" name="custom" value="second-head1" />{" "}
                  <label>รองเฮดภาค อันดับ 1</label>
                </div>
                <div className="inline-flex items-center gap-4 ml-2">
                  <input type="radio" name="custom" value="second-head2" />{" "}
                  <label>รองเฮดภาค อันดับ 2</label>
                </div>
                <div className="inline-flex items-center gap-4 ml-2">
                  <input type="radio" name="custom" value="secretary" />{" "}
                  <label>เลขานุการ</label>
                </div>
                <div className="inline-flex items-center gap-4 ml-2">
                  <input type="radio" name="custom" value="money" />{" "}
                  <label>เหรัญญิก</label>
                </div>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="name"
                placeholder="ชื่อ"
                className="border-2 rounded-lg p-2 w-full mt-4"
              />
              <button
                onClick={addPerson}
                className="bg-green-500 w-full rounded-lg p-4 text-md my-4"
              >
                ส่ง
              </button>
              {isErr && <p className="text-red-500">*มีชื่อนี้อยู่แล้ว!</p>}
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

  const secondheadMale = query(collection(store, "second-head-1"));
  const secondheadMalePos: any[] = [];
  const querySecondheadMaleSnapshot = await getDocs(secondheadMale);
  querySecondheadMaleSnapshot.forEach((doc) => {
    secondheadMalePos.push({ id: doc.id, ...doc.data() });
  });

  const secondheadFemale = query(collection(store, "second-head-2"));
  const secondheadFemalePos: any[] = [];
  const querySecondheadSnapshot = await getDocs(secondheadFemale);
  querySecondheadSnapshot.forEach((doc) => {
    secondheadFemalePos.push({ id: doc.id, ...doc.data() });
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
      secondheadMalePos,
      secondheadFemalePos,
      secretaryPos,
      moneyPos,
    },
  };
}
export default Home;
