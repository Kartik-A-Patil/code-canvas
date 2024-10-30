"use client"
import React, { useState } from "react";
import { auth, provider } from "../config/firebase.utils";
import { signInWithPopup, signInAnonymously, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import logo from "../logo.png"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const Page: React.FC = () => {
    const router = useRouter()
    const { toast } = useToast()
    const [isSignUp, setIsSignUp] = useState(false);
    const [passVisible, setPassVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleSignInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in: ", user);
            toast({
                title: "200",
                description: 'Signed in with Google successfully',
            });
            router.push("/")
        } catch (error: any) {
            console.error("Error signing in: ", error);
            toast({
                title: error.code,
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleSignInAnonymously = async () => {
        try {
            const result = await signInAnonymously(auth);
            const user = result.user;
            console.log(user);

            toast({
                title: '201',
                description: 'Signed in anonymously',
            })
            router.push("/")
        } catch (error: any) {
            toast({
                title: error.code,
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleCreateUser = () => {
        if (email && password && username) {
            // Step 1: Create a temporary account and send a verification email
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed up:", user);

                    // Send email verification
                    sendEmailVerification(user)
                        .then(() => {
                            console.log("Verification email sent to:", user.email);
                            setIsDialogOpen(true);

                            // Step 2: Check email verification status periodically
                            const checkEmailVerified = setInterval(() => {
                                user.reload()
                                    .then(() => {
                                        if (user.emailVerified) {
                                            clearInterval(checkEmailVerified);
                                            console.log("Email verified:", user.email);

                                            // Step 3: Update profile with display name and complete registration
                                            updateProfile(user, {
                                                displayName: username
                                            }).then(() => {
                                                console.log("Username set successfully:", username);
                                                toast({
                                                    title: '200',
                                                    description: "User created successfully. Email verified.",
                                                })
                                                router.push("/");
                                            }).catch((error) => {
                                                console.error("Error setting username:", error);
                                                toast({
                                                    title: error.code,
                                                    description: error.message,
                                                    variant: "destructive"
                                                });
                                                // Rollback user creation if profile update fails
                                                user.delete();
                                            });
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Error reloading user:", error);
                                        toast({
                                            title: error.code,
                                            description: error.message,
                                            variant: "destructive"
                                        });
                                    });
                            }, 2000); // Check every 2 seconds
                        })
                        .catch((error: any) => {
                            console.error("Error sending verification email:", error);
                            toast({
                                title: error.code,
                                description: error.message,
                                variant: "destructive"
                            });
                            // Rollback user creation if verification email sending fails
                            user.delete();
                        });
                })
                .catch((error) => {
                    console.error("Error signing up:", error);
                    toast({
                        title: error.code,
                        description: error.message,
                        variant: "destructive"
                    });
                });
        } else {
            toast({
                description: 'Please enter all credentials',
                variant: "destructive"
            });
        }
    };

    const handleSignIn = () => {
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed in: ", user);
                    toast({
                        title: '200',
                        description: 'Signed in successfully',
                    })
                    router.push("/")
                })
                .catch((error) => {
                    console.error("Error signing in: ", error);
                    toast({
                        title: error.code,
                        description: error.message,
                        variant: "destructive"
                    });
                });
        }
        else {
            toast({
                description: 'Please enter email and password',
                variant: "destructive"
            });
        }
    };

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };
    return (
        <div className="h-screen flex items-center justify-center bg-black">
            <div className="absolute top-[19px] left-[68px]">
                <a onClick={() => router.push("/")} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                    <Image
                        src={logo}
                        alt="logo"
                        width={35}
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">WebLab</span>
                </a>
            </div>
            <div className="relative w-full max-w-lg">

                {isSignUp ?
                    <div className={`absolute inset-0 w-full h-full bg-white flex flex-col justify-center transition-opacity duration-500 `}>
                        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                        <button
                            onClick={handleSignInWithGoogle}
                            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="Google logo"
                                className="w-5 h-5 mr-4"
                                height={20}
                                width={20}
                            />
                            Sign in with Google
                        </button>
                        <button
                            onClick={handleSignInAnonymously}
                            className="w-full bg-gray-900 text-white py-2 rounded-md mb-4 border border-gray-300 focus:outline-none hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 me-2 flex justify-center items-center"
                        >
                            <svg className="w-[25px] h-[25px] text-gray-100 dark:text-white mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="mx-2">Guest</p>
                        </button>
                        <div className="relative mt-2 mb-6">
                            <hr className="border-gray-300 w-full" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-gray-500">or</div>
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear focus:placeholder-opacity-100 focus:text-gray-100"
                                id="signInEmail"
                            />
                            <label
                                htmlFor="signInEmail"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${email ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"
                                    }`}
                            >
                                Email address
                            </label>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type={passVisible ? "password" : "text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear focus:placeholder-opacity-100 focus:text-gray-100"
                                id="signInPassword"
                            />
                            <button type="submit" className="text-white absolute end-4 bottom-2"
                                onClick={() => setPassVisible(!passVisible)}>
                                {passVisible ?
                                    <svg className="w-6 h-6 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                        <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg> :
                                    <svg className="w-6 h-6 text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                }

                            </button>
                            <label
                                htmlFor="signInPassword"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${password ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90  peer-focus:bg-black"
                                    }`}
                            >
                                Password
                            </label>
                        </div>

                     
                        <button type="submit" className="ui-btn w-full py-4 my-0 mb-2"
                            onClick={handleSignIn} >
                            <span>
                                Sign In
                            </span>
                        </button>


                        <p className="text-center">
                            Don&apos;t have an account ? {" "}
                            <a onClick={toggleForm} className="text-blue-500 cursor-pointer">
                                Register
                            </a>
                        </p>
                    </div>
                    :
                    <div className={`absolute inset-0 w-full h-full bg-white  flex flex-col justify-center transition-opacity duration-500 `}>
                        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                        <button
                            onClick={handleSignInWithGoogle}
                            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="Google logo"
                                className="w-5 h-5 mr-4"
                                width={20}
                                height={20}
                            />
                            Sign up with Google
                        </button>
                        <button
                            onClick={handleSignInAnonymously}
                            className="w-full bg-gray-900 text-white py-2 rounded-md mb-4 border border-gray-300 focus:outline-none hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 me-2 flex justify-center items-center"
                        >
                            <svg className="w-[25px] h-[25px] text-gray-100 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="1.2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <p className="mx-2">Guest</p>
                        </button>
                        <div className="relative mt-2 mb-6">
                            <hr className="border-gray-300 w-full" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-gray-500">or</div>
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                id="signUpUsername"
                            />
                            <label
                                htmlFor="signUpUsername"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${username ? "-translate-y-5 px-1 scale-90 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"}`}
                            >
                                Username
                            </label>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                id="signUpEmail"
                            />
                            <label
                                htmlFor="signUpEmail"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${email ? "-translate-y-5 px-1 scale-9 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"
                                    }`}
                            >
                                Email address
                            </label>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type={passVisible ? "password" : "text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer block min-h-[auto] w-full border border-gray-300 rounded-lg bg-transparent px-3 py-2 leading-6 transition-all duration-200 ease-linear "
                                id="signUpPassword"
                            />
                            <button type="submit" className="text-white absolute end-4 bottom-2"
                                onClick={() => setPassVisible(!passVisible)}>
                                {passVisible ?
                                    <svg className="w-6 h-6 text-gray-100 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                        <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg> :
                                    <svg className="w-6 h-6 text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                }

                            </button>
                            <label
                                htmlFor="signUpPassword"
                                className={`absolute left-3 top-1 mb-0 max-w-[90%] pt-1 text-gray-500 transition-all duration-200 ease-out ${password ? "-translate-y-5 px-1 scale-9 bg-black" : "peer-focus:-translate-y-5 peer-focus:px-1 peer-focus:scale-90 peer-focus:bg-black"
                                    }`}
                            >
                                Password
                            </label>
                        </div>

                      
                        <button type="submit" className="ui-btn w-full py-4 my-0 mb-2"
                            onClick={handleCreateUser}>
                            <span>
                                Sign Up
                            </span>
                        </button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[425px] bg-black">
                                <DialogHeader>
                                    <DialogTitle>Email Verification</DialogTitle>
                                    <DialogDescription >
                                        An email has been sent to your <span className="text-gray-200">{email}</span>. Click the link to verify.
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <Button type="submit" onClick={() => { setIsDialogOpen(false) }}>Cancel</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <p className="text-center">
                            Already have an account ? {" "}
                            <a onClick={toggleForm} className="text-blue-500 cursor-pointer">
                                Login
                            </a>
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Page;
