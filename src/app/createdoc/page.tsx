"use client";
import { useState, useEffect, Suspense } from "react";
import Editor from "@monaco-editor/react";
import styles from "./page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3, faJs } from "@fortawesome/free-brands-svg-icons";
import Navbar from "../component/Navbar";
import { collection, addDoc } from "firebase/firestore";
import Footer from "../component/Footer";
import { db } from '../config/firebase.utils'
import { Button } from "@/components/ui/button";
import { auth } from "../config/firebase.utils";
import { onAuthStateChanged } from "firebase/auth";
interface File {
  name: string;
  language: string;
  value: string;
}
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const files: { [key: string]: File } = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div> </div>",
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: ``,
  }
};

const EditorComp: React.FC = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {

        console.log(user.uid)
        SetUId(user.uid)
      } else {
        console.log("no user is signed in", user);
      }
    });
  }, [])

  const [fileName, setFileName] = useState<string>("index.html");
  const [html, setHtmlCode] = useState<string>("");
  const [css, setCssCode] = useState<string>("");
  const [Type, setType] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [uId, SetUId] = useState<string>("");


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
  // Function to create a new element
  const createElement = async (userId: string) => {
    try {
      const elementData = {
        html,
        css,
        userId: userId,
        timestamp: new Date(),
        title,
        tags: ["tag1", "tag2"],
        type: Type,
        views: 0,
        likes: 0
      };
      await addDoc(collection(db, "elements"), elementData);
      console.log("Element created successfully");
      setHtmlCode("");
      setCssCode("");
    } catch (error) {
      console.error("Error creating element: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row flex-wrap justify-evenly">
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
              <Select onValueChange={(e) => {
                setType(e)
              }}>
                <SelectTrigger className="w-[180px] bg-black my-auto ml-5 border-gray-800">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent className="bg-black text-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-600">Types of Elements</SelectLabel>
                    <SelectItem value="button" >Button</SelectItem>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="toggle">Toggle</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="loader">Loader</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                if (Type && title) { // Check if type and title are selected
                  createElement(uId);
                } else {
                  alert("Please select type and provide title before creating the element.");
                }
              }}
              type="button"
              variant={'outline'}
              className="bg-black my-auto mr-5"
            >
              Create Element
            </Button>

          </div>
          <Editor
            height="75vh"
            width="900px"
            theme="vs-dark"
            saveViewState={true}
            path={files[fileName].name}
            defaultLanguage={files[fileName].language}
            defaultValue={files[fileName].value}
            onChange={(value) => handleEditorChange(value)}
          />
        </div>

        <div className="flex flex-col justify-evenly items-center">
          <div>
            <div className="relative mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                id="signUpUsername"
              />
              <label
                htmlFor="signUpUsername"
                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${title ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"}`}
              >
                title
              </label>
            </div>

          </div>
          <div>
            <iframe
              id="outputWindow"
              title="output"
              srcDoc={`
                    <html>
                      <body>${html}</body>
                      <style>body{
    min-height: 280px;
    display: grid;
    place-items: center;
}${css}</style>
                    </html>
                        `}
              className={styles.outputiframewindow}
            />
          </div>
        </div>
      </div>
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
