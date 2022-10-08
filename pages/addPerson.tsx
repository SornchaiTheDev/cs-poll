import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import useSession from "../hooks/useSession";
import Link from "next/link";

function AddPerson() {
  const [name, setName] = useState<string>("");
  const [isCanAdd, setIsCanAdd] = useState<boolean>(true);
  const [position, setPosition] = useState<string>("head");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isErr, setIsErr] = useState<boolean>(false);
  const router = useRouter();

  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading) {
      if (session === null) {
        localStorage.removeItem("accesstoken");
        router.replace("/login");
      }
    }
  }, [loading]);

  const getRemains = async () => {
    setIsLoading(true);
    const getRemains = await axios.post("/api/getRemains", {
      token: localStorage.getItem("accesstoken"),
    });
    setIsCanAdd(getRemains.data.position === null);
    setIsLoading(false);
  };

  useEffect(() => {
    getRemains();
  }, []);

  const addPerson = async () => {
    if (position === null || name === "") return;
    const firstName = session!.firstNameTh;

    const exp = new RegExp(firstName, "g");

    if (name.match(exp)) {
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
    }
  };

  const handleOnRadioChange = (e: any) => {
    setPosition(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-10 container mx-auto max-w-lg gap-4 px-6">
      <div className="bg-white border-2 px-10 py-4 rounded-lg  flex flex-col w-full">
        <Link href="/">
          <a className="inline-flex items-center gap-2 py-4 w-fit">
            <BsArrowLeft /> <h2>กลับหน้าหลัก</h2>
          </a>
        </Link>
        {isLoading ? (
          <h1 className="text-center my-10">กำลังโหลด ...</h1>
        ) : !isCanAdd ? (
          <div className="m-4 bg-red-500 py-4 rounded-lg">
            <h1 className="text-white font-bold text-center">
              ไม่สามารถเสนอชื่อได้แล้ว
            </h1>
          </div>
        ) : (
          <>
            <div className="my-4 ">
              <h2 className="text-lg mt-4 text-center font-bold">
                เสนอชื่อตัวเอง
              </h2>
              <p className="text-red-500 text-center">
                *เสนอเข้าทำงานได้เพียง 1 ตำแหน่งเท่านั้น
              </p>
            </div>
            <h2>ตำแหน่ง</h2>

            <select
              className="text-xl border-2 rounded-lg p-2 mt-2"
              onChange={handleOnRadioChange}
            >
              {["head", "second-head", "secretary", "money"].map((position) => (
                <option value={position} key={position}>
                  {position === "head"
                    ? "เฮดภาค"
                    : position === "second-head"
                    ? "รองเฮดภาค"
                    : position === "secretary"
                    ? "เลขานุการ"
                    : position === "money"
                    ? "เหรัญญิก"
                    : ""}
                </option>
              ))}
            </select>

            <div className="my-4">
              <h2>ชื่อ</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="name"
                placeholder="ชื่อเล่น (ชื่อจริง)"
                className="border-2 rounded-lg p-2 w-full mt-2"
              />
            </div>
            <button
              disabled={name === ""}
              onClick={addPerson}
              className="bg-lime-400 active:bg-lime-500 disabled:bg-gray-200 w-full rounded-lg px-4 py-2  text-md my-4"
            >
              ส่ง
            </button>
            {isErr && <p className="text-red-500">*มีชื่อนี้อยู่แล้ว!</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default AddPerson;
