// import React from "react";
// import Navbar from "../components/Navbar";
// import Header from "../components/Header";

// const Home = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <Navbar/>
//       <Header />
     
//     </div>
//   );
// };

// export default Home;


import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
