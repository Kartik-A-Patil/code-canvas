"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import styles from "./page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3 } from "@fortawesome/free-brands-svg-icons";
import Navbar from "../component/Navbar";
import html2canvas from "html2canvas";
import { db } from "../config/firebase.utils";
import { getDoc, doc } from "firebase/firestore";
import Footer from "../component/Footer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
interface File {
  name: string;
  language: string;
  value: string;
}

const files: { [key: string]: File } = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: "",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: "",
  }
};



const EditorComp: React.FC = () => {
  const searchParams = useSearchParams();
  const elementId = searchParams.get("id") || "No Id found";

  const [fileName, setFileName] = useState<string>("index.html");
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [similarityPercentage, setSimilarityPercentage] = useState<number>(0);
  const [CompareElt, setCompareElt] = useState<any>([]);

  function handleEditorChange(value: string | undefined) {
    if (typeof value === "string") {
      const updatedFile = { ...files[fileName], value };
      files[fileName] = updatedFile;

      switch (updatedFile.language) {
        case "html":
          setHtmlCode(value);
          break;
        case "css":
          setCssCode(value);
          break;
        default:
          break;
      }
    }
  }
  useEffect(() => {
    fetchElementById(elementId)
  }, [elementId])
  useEffect(() => {
    const outputWindow = document.getElementById("outputWindow") as HTMLIFrameElement;
    const compareWindow = document.getElementById("compareWindow") as HTMLIFrameElement;

    function onLoadHandler() {
      calculateSimilarityPercentage();
    }

    if (outputWindow && compareWindow) {
      outputWindow.addEventListener("load", onLoadHandler);
      compareWindow.addEventListener("load", onLoadHandler);

      return () => {
        outputWindow.removeEventListener("load", onLoadHandler);
        compareWindow.removeEventListener("load", onLoadHandler);
      };
    }
  }, []);

  useEffect(() => {
    calculateSimilarityPercentage();
  }, [htmlCode, cssCode]);

  function calculateSimilarityPercentage() {
    const outputWindow = document.getElementById("outputWindow") as HTMLIFrameElement;
    const compareWindow = document.getElementById("compareWindow") as HTMLIFrameElement;

    if (outputWindow && compareWindow) {
      const outputWindowElement = outputWindow.contentWindow?.document.querySelector("button");
      const compareWindowElement = compareWindow.contentWindow?.document.querySelector("button");

      if (outputWindowElement && compareWindowElement) {
        html2canvas(outputWindowElement as HTMLElement).then((outputCanvas) => {
          const outputCtx = outputCanvas.getContext("2d");
          if (outputCtx) {
            const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);

            html2canvas(compareWindowElement as HTMLElement).then((compareCanvas) => {
              const compareCtx = compareCanvas.getContext("2d");
              if (compareCtx) {
                const compareImageData = compareCtx.getImageData(0, 0, compareCanvas.width, compareCanvas.height);

                let matchingPixels = 0;
                for (let i = 0; i < outputImageData.data.length; i += 4) {
                  const isPixelMatch = outputImageData.data[i] === compareImageData.data[i] &&
                    outputImageData.data[i + 1] === compareImageData.data[i + 1] &&
                    outputImageData.data[i + 2] === compareImageData.data[i + 2] &&
                    outputImageData.data[i + 3] === compareImageData.data[i + 3];
                  if (isPixelMatch) {
                    matchingPixels++;
                  }
                }
                const similarityPercentage = (matchingPixels / (outputImageData.data.length / 4)) * 100;
                setSimilarityPercentage(similarityPercentage);
              }
            }).catch(err => {
              console.error("Error generating compare canvas:", err);
            });
          }
        }).catch(err => {
          console.error("Error generating output canvas:", err);
        });
      }
    }
  }

  const fetchElementById = async (elementId: string) => {
    try {
      const elementDoc = doc(db, "elements", elementId);
      const elementSnapshot = await getDoc(elementDoc);
      console.log(elementSnapshot.data());
      if (elementSnapshot.exists()) {
        let data = elementSnapshot.data()
        setCompareElt(data)
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching element: ", error);
      return null;
    }
  };

  return (
    <>
      <Navbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-screen rounded-lg border border-gray-600"
      >
        <ResizablePanel defaultSize={65}>
          <div className="rounded-xl">
            <div className={styles.topBar}>
              <div className="flex flex-row">
                <button
                  className={styles.htmlButton}
                  disabled={fileName === "index.html"}
                  onClick={() => setFileName("index.html")}
                >
                  <div>
                    <FontAwesomeIcon icon={faHtml5} />
                  </div>
                  index.html
                </button>
                <button
                  className={styles.cssButton}
                  disabled={fileName === "style.css"}
                  onClick={() => setFileName("style.css")}
                >
                  <div>
                    <FontAwesomeIcon icon={faCss3} />
                  </div>
                  style.css
                </button>
              </div>

              <div className="flex flex-row items-center justify-evenly ">
                <p className="mx-4">Similarity: {similarityPercentage.toFixed(2)}%</p>

              </div>

            </div>
            <Editor
              height="75vh"
              width="auto"
              theme="vs-dark"
              saveViewState={true}
              path={files[fileName].name}
              defaultLanguage={files[fileName].language}
              defaultValue={files[fileName].value}
              onChange={(value) => handleEditorChange(value)}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={35}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center">
                <iframe
                  id="outputWindow"
                  title="output"
                  srcDoc={`
                    <html>
                      <body>${htmlCode}</body>
                      <style>body{
    min-height: 280px;
    display: grid;
    place-items: center;
}${cssCode}</style>
                    </html>
                        `}
                  className='h-full w-full'
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center">
                <iframe
                  id="compareWindow"
                  title="compare output"
                  srcDoc={`
                    <html>
                      <body> ${CompareElt.html}</body>
                      <style>body{
    min-height: 280px;
    display: grid;
    place-items: center;
}${CompareElt.css}</style>
                    </html>
                        `}
                  className='h-full w-full'
                />
                
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Footer />
    </>
  );
}


const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorComp />
    </Suspense>
  )
}

export default page;
