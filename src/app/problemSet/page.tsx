"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/Navbar";
import { db } from "../config/firebase.utils";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "../component/Footer";
import Meteors from "../component/Meteors";


interface Element {
  id: string;
  html: string;
  css: string;
  js: string;
  type: string;
}

const ProblemSet = () => {
  const router = useRouter();
  const [elements, setElements] = useState<Element[]>([]);
  const [currentType, setCurrentType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch elements from Firestore
  const fetchElements = async (type: string) => {
    setLoading(true);
    const elementsCollection = collection(db, "elements");
    let q;

    if (type === "all") {
      q = elementsCollection; // Fetch all documents
    } else {
      q = query(elementsCollection, where("type", "==", type)); // Fetch documents matching the type
    }

    const elementsSnapshot = await getDocs(q);
    const elementsData = elementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Element));
    setElements(elementsData);
    setLoading(false);
    console.log(elementsData);

  };

  const handleTypeChange = (setType: string) => {
    setCurrentType(setType);
  };

  useEffect(() => {
    fetchElements(currentType);
    console.log(elements);
  }, [currentType]);

  const deleteElement = async (elementId: string) => {
    try {
      await deleteDoc(doc(db, "elements", elementId));
      console.log("Element deleted successfully");
      fetchElements(currentType);
    } catch (error) {
      console.error("Error deleting element: ", error);
    }
  };

  const navigateToElement = (elementId: string) => {
    router.push(`/editor?id=${elementId}`);
  };

  return (
    <>
      <div className="galactic-background min-h-screen relative overflow-hidden bg-black">
        <Meteors />
        <Navbar />
        <div className="flex flex-col">
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 justify-center">
            {["all", "button", "input", "toggle", "cards", "loader"].map(type => (
              <li className="me-2" key={type}>
                <button
                  onClick={() => handleTypeChange(type)}
                  disabled={currentType === type}
                  className={`inline-block px-4 py-3 ${currentType === type ? "text-purple-600 cursor-not-allowed border-dashed border-b-2 border-purple-600" : "hover:text-purple-600 hover:border-dashed hover:border-b-2 hover:border-purple-600"}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 w-full flex flex-row flex-wrap justify-evenly">
            {loading ? (
              <div className="w-full flex flex-row flex-wrap justify-evenly">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} className="h-[220px] w-[300px] rounded-lg bg-neutral-800 mx-2.5 my-3" />
                ))}
              </div>
            ) : (
              elements.map((comp, index) => (
                <div
                  key={index}
                  className="border h-56 mx-2.5 my-3 rounded-lg border-gray-800 relative hover:border-gray-700 transition-all duration-200 backdrop-blur-[3px]"
                  onClick={() => navigateToElement(comp.id)}
                >
                  <iframe
                    id={`outputWindow-${index}`}
                    className="h-full w-full"
                    title="output"
                    srcDoc={`
                          <html>
                             <body>${comp.html}</body>
                             <style>body{display:grid;place-items:center; height:200px;}${comp.css}</style>
                            <script>${comp.js}</script>
                           </html>
                            `}
                  />
                  {/* <p>{comp.title}</p> */}
                  <div className="absolute inset-0 bg-transparent cursor-pointer" />
                  {/* <button onClick={() => deleteElement(comp.id)}>Delete</button> */}
                </div>

              ))
            )}
          </div>


        </div>
      </div>
      {/* <button onClick={() => navigateToElement(comp.id)}>View Details</button> */}
      <Footer />
    </>
  );
};

export default ProblemSet;
