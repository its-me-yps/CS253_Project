import ClothItem from "../components/washClothesComponents/clothItem";
import Below from "../components/washClothesComponents/below";

import { useState } from "react";

const WashClothes = () => {
  const [counter, setCounter] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // Function to increment the counter
  const incrementCounter = (number) => {
    setCounter((prevCounter) => ({
      ...prevCounter,
      [number]: prevCounter[number] + 1,
    }));
  };

  const decrementCounter = (number) => {
    if (counter[number] > 0) {
      setCounter((prevCounter) => ({
        ...prevCounter,
        [number]: prevCounter[number] - 1,
      }));
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center h-screen p-10 max-w-xl mx-auto"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #b1dfdfef, hsl(0, 35%, 85%))",
        }}
      >
        <div className="form">
          <div className="">
            {/* h-screen flex flex-col items-center */}

            <button className="bg-blue-500 text-white px-4 py-2 mt-4 text-lg  rounded-full justify-start font-extrabold">
              back
            </button>
            <div className="text-2xl font-bold text-blue-500">
              Please chose Clothes
            </div>
            {/* <div>
        <Tab/>
      </div> */}
            <div className="App">
              <ClothItem
                counter={counter["1"]}
                onclick1={() => incrementCounter("1")}
                onclick2={() => decrementCounter("1")}
                cloth={"upper wear"}
                imx={"Tshirt.png"}
              />
              <ClothItem
                counter={counter["2"]}
                onclick1={() => incrementCounter("2")}
                onclick2={() => decrementCounter("2")}
                cloth={"Lower wear"}
                imx={"pants.png"}
              />
              <ClothItem
                counter={counter["3"]}
                onclick1={() => incrementCounter("3")}
                onclick2={() => decrementCounter("3")}
                cloth={"Socks"}
                imx={"sock.png"}
              />
              <ClothItem
                counter={counter["4"]}
                onclick1={() => incrementCounter("4")}
                onclick2={() => decrementCounter("4")}
                cloth={"Heavy wear"}
                imx={"H_upper.png"}
              />
              <ClothItem
                counter={counter["5"]}
                onclick1={() => incrementCounter("5")}
                onclick2={() => decrementCounter("5")}
                cloth={"Miscell- aneous"}
                imx={"Question_mark.png"}
              />
            </div>
            <div>
              <Below counter={counter} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WashClothes;
