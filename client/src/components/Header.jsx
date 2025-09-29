// import React, {useContext} from "react";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/AppContext"; 
// const Header = () => {

//   const {userData} = useContext(AppContext)

//   return (
//     <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
//       <img src={assets.header_img} className="w-36 h-36 rounded-full mb-6" />
//       <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
//         Hey {userData? userData.name: "Developer"}!{" "}
//         <img className="w-8 aspect-square" src={assets.hand_wave}></img>
//       </h1>
//       <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
//         Welcome to our App
//       </h2>
//       <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
//         Get Started
//       </button>
//     </div>
//   );
// };

// export default Header;

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className="w-full mt-28 sm:mt-36 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={assets.header_img}
              alt="mascot"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full shadow-xl ring-4 ring-white/70"
            />
            {/* <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs px-3 py-1 rounded-full bg-white shadow border border-indigo-100 text-indigo-700">
              Friendly Onboarding :)
            </span> */}
          </div>

          <h1 className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-medium text-slate-600">
            Hey {userData ? userData.name : "Developer"}!
            <img className="w-6 aspect-square" src={assets.hand_wave} alt="wave" />
          </h1>

          <h2 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Welcome to our App
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-slate-600">
            Simple, secure authentication with a clean developer-first experience.
          </p>

          <button
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-white font-medium shadow-lg
                       bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={() => navigate("/login")}>
            Get Started
            <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4" />
          </button>

          {/* subtle card behind hero for depth */}
          <div className="mt-16 w-full">
            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur
                            shadow-sm p-6 sm:p-8 text-left">
              <h3 className="text-slate-800 font-semibold text-lg mb-2">Why Auth?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fast sign up, email verification, and password reset flows out of the box.
                Hook into the API and ship auth without the headache.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
