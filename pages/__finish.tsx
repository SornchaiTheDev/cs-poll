import React from "react";

function Finish({ loading, votes }) {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-10 container mx-auto max-w-lg gap-4">
      <div className="bg-white border-2 px-10 py-4 rounded-lg  flex flex-col w-full">
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
                    <input type="radio" name="head" value={id} />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl my-4">รองเฮดภาค</h1>
              <div className="flex flex-col gap-4">
                {secondHeadPos.map(({ name, id }: any) => (
                  <div
                    className="inline-flex items-center gap-4 text-xl"
                    key={id}
                  >
                    <input type="radio" name="second-head" value={id} />
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
                    <input type="radio" name="secretary" value={id} />
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
                    <input type="radio" name="money" value={id} />
                    <h4>{name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Finish;
