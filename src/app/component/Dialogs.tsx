import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import styles from "../editor/page.module.css";
import Editor from "@monaco-editor/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3, faJs } from "@fortawesome/free-brands-svg-icons";
interface DialogProps {
    showHint: boolean;
    setShowHint: any;
}
interface File {
    name: string;
    language: string;
    value: string;
}
const HintDialog: React.FC<DialogProps> = ({ showHint, setShowHint }) => {
    const [fileName, setFileName] = useState<string>("index.html");

    const files: { [key: string]: File } = {
        "index.html": {
            name: "index.html",
            language: "html",
            value: "html",
        },
        "style.css": {
            name: "style.css",
            language: "css",
            value: "css",
        },
        "script.js": {
            name: "script.js",
            language: "javascript",
            value: "js",
        },
    };
    return (
        <Dialog open={showHint} onOpenChange={setShowHint}>
            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex flex-row justify-evenly bg-[#242424]">

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
                        <button
                            className={styles.jsButton}
                            disabled={fileName === "script.js"}
                            onClick={() => setFileName("script.js")}
                        >
                            <div>
                                <FontAwesomeIcon icon={faJs} />
                            </div>{" "}
                            script.js
                        </button>
                    </div>
                    <Editor
                        height="200px"
                        width="375px"
                        theme="vs-dark"
                        saveViewState={true}
                        options={{
                            minimap: {
                                enabled: false
                            },
                            lineNumbersMinChars: 2,
                            readOnly: true
                        }}
                        path={files[fileName].name}
                        defaultLanguage={files[fileName].language}
                        value={files[fileName].value}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export { HintDialog }