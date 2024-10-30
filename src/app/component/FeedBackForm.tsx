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
import { db } from "../config/firebase.utils";
import { collection, addDoc } from "firebase/firestore";

function FeedBackForm() {
    const [feedback, setFeedback] = useState("");
    const [email, setEmail] = useState("");


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const feedbackData = {
                email,
                feedback,
                timestamp: new Date().toISOString()
            };
            await addDoc(collection(db, "feedback"), feedbackData);

            // Clear the form after submission
            setEmail("");
            setFeedback("");
            console.log("Feedback submitted successfully!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <a className="hover:underline me-4 md:me-6 cursor-pointer">FeedBack / Report Issue</a>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Your feedback is very valueable for Us
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="relative mb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear focus:placeholder-opacity-100 focus:text-gray-100"
                                id="Email"
                            />
                            <label
                                htmlFor="Email"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${email ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"
                                    }`}
                            >
                                Email address
                            </label>
                        </div>

                        <div className="relative mb-6">
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                id="feedback"
                                rows={4}
                            />
                            <label
                                htmlFor="feedback"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${feedback ? "-translate-y-5 px-1 scale-9 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"
                                    }`}
                            >
                                FeedBack/Report Issue
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="outline" className="bg-black">Send Feedback/Report</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default FeedBackForm;
