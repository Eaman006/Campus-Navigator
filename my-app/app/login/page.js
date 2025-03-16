"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    const video = document.querySelector("video");
    const images = Array.from(document.querySelectorAll("img"));

    const mediaElements = [video, ...images];
    let loadedCount = 0;

    mediaElements.forEach((media) => {
      if (media.complete || media.readyState >= 3) {
        loadedCount++;
      } else {
        media.addEventListener("loadeddata", () => {
          loadedCount++;
          if (loadedCount === mediaElements.length) handleLoad();
        });
        media.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === mediaElements.length) handleLoad();
        });
      }
    });

    if (loadedCount === mediaElements.length) handleLoad();
  }, []);

  return (
    <div className="relative w-full h-screen select-none">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative w-full h-screen">
        <div className="w-full h-full">
          <video
            className="w-full h-[70%] object-cover"
            loop
            autoPlay
            muted
            src="/login.mp4"
          />
        </div>

        {/* Background Image */}
        <div className="absolute bottom-0 w-screen">
          <Image
            width={1920}
            height={400}
            alt="background"
            src="/login.png"
            className="w-full h-[50vh] object-fill"
          />
        </div>

        {/* Login Card */}
        <div className="w-full absolute top-[15%] px-32">
          <div className="bg-[#F8F9FA] rounded-lg px-14 w-1/2 mx-auto my-5 py-5">
            {/* Logo */}
            <div className="flex justify-center items-center">
              <Image src="/logo.png" width={100} height={100} alt="logo" />
            </div>

            {/* Title */}
            <div className="font-bold text-black text-5xl text-center mx-2 mt-4">
              Campus Navigator
            </div>
            <div className="font-bold text-black text-2xl text-center">
              by VIT for VIT
            </div>

            {/* Explore as Guest Button */}
            <div className="bg-[#007BFF] text-white flex my-7 p-2 rounded-lg mx-2 hover:scale-105 transition-transform duration-700 cursor-pointer select-none">
              <div className="w-4/5">
                <div className="text-3xl font-bold mx-5 mt-1">
                  Explore as Guest
                </div>
                <div className="mx-5 text-sm">Quick access with limited features</div>
              </div>
              <div>
                <Image src="/profile.png" width={70} height={70} alt="profile" />
              </div>
            </div>

            {/* Sign in with Google Button */}
            <div className="bg-[#007BFF] text-white flex my-3 p-2 rounded-lg mx-2 hover:scale-105 transition-transform duration-700 cursor-pointer select-none">
              <div className="w-4/5">
                <div className="text-3xl font-bold mx-5 mt-1">
                  Sign in with Google
                </div>
                <div className="mx-5 text-sm">Access all features</div>
              </div>
              <div>
                <Image src="/google.png" width={70} height={70} alt="google" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
