import React from 'react'
import { useRouter } from 'next/navigation'
import logo from '../logo.png'
import Image from 'next/image'
import AboutDrawer from "../component/aboutDrawer";
import FeedBackForm from "../component/FeedBackForm";
const Footer = () => {
    const router = useRouter()
    return (
        <footer className="bg-transparent rounded-lg shadow m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a onClick={() => router.push('/')} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                        <Image
                            src={logo}
                            alt="logo"
                            width={35}
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">WebLab</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <AboutDrawer />
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                        </li>
                        <li>
                            <FeedBackForm />
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="/" className="hover:underline">WebLab™</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}

export default Footer