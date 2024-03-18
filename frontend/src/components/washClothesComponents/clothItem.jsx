import React, { useState } from 'react';

const ClothItem = ({ cloth, imx,counter,onclick1,onclick2 }) => {
    return (
        <div className="rounded-md border-2 p-15 m-1 flex flex-row bg-gray-300 shadow-md">
            <div className="flex-none p-5 items-center">
                <img src={imx} alt="My Image"  className="object-cover w-20 h-20" />
            </div>
            <div className="flex-auto p-1 flex items-center  text-pink-400 text-left font-extrabold text-2xl">
                {cloth}
            </div>
            

            <div className="flex-none p-3 flex items-center justify-center">
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 text-lg  rounded-full justify-start font-extrabold" onClick={onclick2}>
                    -
                </button>
            </div>


            <div className="flex-none p-3 flex items-center justify-center text-lg font-semibold underline-offset-8">
                {counter}
            </div>


            <div className="flex-none p-3 flex items-center justify-center">
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 text-lg  rounded-full font-extrabold" onClick={onclick1}>
                    +
                </button>

            </div>
        </div>
    )
}

export default ClothItem;