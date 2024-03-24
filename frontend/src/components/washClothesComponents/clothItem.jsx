import React from 'react';

const ClothItem = ({ cloth, imx, counter, onclick1, onclick2 }) => {
    return (
        <div className="rounded-md border-2 p-3 md:p-5 m-1 flex flex-row bg-gray-300 shadow-md items-center">
            <div className="flex-none p-1 md:p-3">
                <img src={imx} alt="My Image" className="object-cover w-12 h-12 md:w-20 md:h-20" />
            </div>
            <div className="flex-auto p-1 text-pink-400 text-left font-extrabold text-sm md:text-xl">
                {cloth}
            </div>

            <div className="flex-none p-1 md:p-3 flex items-center justify-center">
                <button className="bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 text-sm md:text-lg rounded-full justify-start font-extrabold" onClick={onclick2}>
                    -
                </button>
            </div>

            <div className="flex-none p-1 md:p-3 flex items-center justify-center text-sm md:text-lg font-semibold underline-offset-4">
                {counter}
            </div>

            <div className="flex-none p-1 md:p-3 flex items-center justify-center">
                <button className="bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 text-sm md:text-lg rounded-full font-extrabold" onClick={onclick1}>
                    +
                </button>
            </div>
        </div>
    )
}

export default ClothItem;
