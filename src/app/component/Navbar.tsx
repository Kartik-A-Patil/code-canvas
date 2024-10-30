"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import logo from "../logo.png"
import Image from "next/image"
import { auth } from "../config/firebase.utils";
import { onAuthStateChanged, updateProfile, updateEmail, sendEmailVerification, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import FeedBackForm from "./FeedBackForm";
import { useToast } from "@/components/ui/use-toast"
import { log } from "console"

const Navbar = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [User, SetUser] = useState<any>(null)
    const [username, setUsername] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                SetUser(user)
                setUsername(user.displayName)
                setEmail(user.email)
                console.log(user);
            } else {
                SetUser(null)
                console.log("no user is signed in", user);
            }
        });
    }, [])


    const handleUpdateProfile = () => {
        setIsDialogOpen(true);
    };

    const confirmUpdateProfile = () => {
        setIsDialogOpen(false);

        if (User !== null) {
            const updateTasks = [];

            // Update username if provided
            if (username !== User.displayName) {
                const updateUsernameTask = updateProfile(User!, { displayName: username })
                    .then(() => {
                        console.log("Username set successfully:", username);
                        toast({
                            title: "200",
                            description: "Username updated successfully",
                        });
                    })
                    .catch((error) => {
                        console.error("Error setting username:", error);
                        toast({
                            title: error.code,
                            description: error.message,
                            variant: "destructive"
                        });
                    });
                updateTasks.push(updateUsernameTask);
            }

            // Update email if provided
            if (auth.currentUser && email !== auth.currentUser?.email) {
                if (auth.currentUser) {
                    const updateEmailTask = sendEmailVerification(auth.currentUser)
                        .then(() => {
                            console.log("Verification email sent to:", email);
                            toast({
                                title: "200",
                                description: "Verification email sent. Please verify your email.",
                            });

                            // Poll for email verification link click
                            return new Promise<void>((resolve, reject) => {
                                const interval = setInterval(() => {
                                    if (auth.currentUser) {
                                        auth.currentUser.reload().then(() => {
                                            if (auth.currentUser?.email !== email) {
                                                // Assuming that if the email is changed, verification is confirmed.
                                                clearInterval(interval);
                                                updateEmail(auth.currentUser!, email).then(() => {
                                                    console.log("Email updated successfully:", email);
                                                    toast({
                                                        title: "200",
                                                        description: 'Email updated successfully',
                                                    });
                                                    resolve();
                                                }).catch((error) => {
                                                    console.error("Error updating email:", error);
                                                    toast({
                                                        title: error.code,
                                                        description: error.message,
                                                        variant: "destructive"
                                                    });
                                                    reject(error);
                                                });
                                            }
                                        });
                                    } else {
                                        clearInterval(interval);
                                        reject(new Error("Current user is null"));
                                    }
                                }, 3000); // Check every 3 seconds
                            });
                        })
                        .catch((error) => {
                            console.error("Error sending verification email:", error);
                            toast({
                                title: error.code,
                                description: error.message,
                                variant: "destructive"
                            });
                        });
                    updateTasks.push(updateEmailTask);
                } else {
                    toast({
                        title: "400",
                        description: 'Current user is null',
                    });
                }
            }

            // Execute all update tasks
            Promise.all(updateTasks)
                .then(() => {
                    console.log("Profile updates completed");
                })
                .catch((error) => {
                    console.error("Error during profile updates:", error);
                    toast({
                        title: error.code,
                        description: error.message,
                        variant: "destructive"
                    });
                });
        } else {
            console.error("User is null");
            toast({
                title: "400",
                description: 'User is null',
            });
        }
    };


    const handleSignOut = () => {
        signOut(auth).then(() => {
            toast({
                title: "200",
                description: 'Signed Out successfully',
            });
            console.log('sign out');

        }).catch((error) => {
            toast({
                title: error.code,
                description: error.message,
                variant: "destructive"
            });
        });
    }
    return (
        <nav className="bg-transparent border-gray-200 ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a onClick={() => router.push("/")} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                    <Image
                        src={logo}
                        alt="logo"
                        width={35}
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">WebLab</span>
                </a>

                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {User == null ?
                        <button
                            onClick={() => router.push("/signIn")}
                            className=" align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 border border-gray-100 text-white hover:text-black hover:bg-white focus:ring focus:ring-gray-300 active:opacity-[0.85] rounded-full"
                            type="button">
                            Sign In
                        </button>
                        :
                        <Sheet >
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button">
                                    {User.PhotoURL !== null ?
                                        <Image
                                            className="w-8 h-8 rounded-full"
                                            src={User.photoURL}
                                            alt="user photo"
                                            width={20}
                                            height={20}
                                        />
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                        </svg>}
                                </button>
                            </SheetTrigger>
                            <SheetContent className="bg-black">
                                <SheetHeader>
                                    <SheetTitle className="text-white">Edit profile</SheetTitle>
                                    <SheetDescription>
                                        Make changes to your profile&apos;s Username here. Click save when you&apos;re done.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                            id="Username"
                                        />
                                        <label
                                            htmlFor="Username"
                                            className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${username ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"}`}
                                        >
                                            Username
                                        </label>
                                    </div>
                                    <div className="relative mb-6">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                            id="email"
                                        />
                                        <label
                                            htmlFor="email"
                                            className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${email ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"}`}
                                        >
                                            Email
                                        </label>
                                    </div>
                                    <Button onClick={()=>router.push('/createdoc')} type="button" className=" text-white bg-black hover:bg-gray-300 hover:text-black border border-white rounded-lg">Contribute to Problems</Button>
                                </div>
                                <SheetFooter >
                                    <SheetClose asChild>
                                        <Button onClick={handleUpdateProfile} type="button" className=" text-black bg-white hover:bg-gray-500 border border-white rounded-lg">Save changes</Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button type="submit" className=" text-white bg-red-600 hover:bg-gray-300 hover:text-black border border-white rounded-lg">Sign Out</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-black">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle >Sign Out</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to sign out? You will need to enter your credentials to log back in.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className=" text-white bg-black hover:bg-gray-300 hover:text-black border border-white rounded-lg">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-700 hover:bg-red-950" onClick={handleSignOut}>Sign Out</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    }
                    <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
                        <li>
                            <button
                                onClick={() => router.push("/")}
                                className="block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent  md:p-0 hover:text-gray-400">Home</button>
                        </li>

                        <li>
                            <button
                                onClick={() => router.push("/problemSet")}
                                className="block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent  md:p-0 hover:text-gray-400">ProblemSet</button>
                        </li>
                        <li>
                            <FeedBackForm />
                        </li>
                    </ul>
                </div>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="bg-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to save the changes to your profile?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white bg-black hover:bg-gray-300 hover:text-black border border-white rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmUpdateProfile} className="bg-green-700 hover:bg-green-950">Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </nav>
    )
}

export default Navbar
