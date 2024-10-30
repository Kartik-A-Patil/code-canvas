// pages/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Meteors from "./component/Meteors";
const Home = () => {
 
  return (
    <main>
      <div className="galactic-background  relative overflow-hidden bg-black">
        <Meteors />
        <Navbar />
        <div className="container mx-auto py-16 z-10 text-center my-36">
          <h1 className="text-white text-4xl font-bold">Welcome to the <span className="text-orange-300">Web</span>Lab!</h1>
          <p className="text-white mt-4">Pulse up your coding skills. Get ready to level up!</p>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Home;
