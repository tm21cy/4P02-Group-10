import { SignIn } from "@clerk/nextjs";
import React from "react";

/**
 * JSX template for authentication.
 * Handles user authentication components and synchronizes auth state.
 * @returns JSX component.
 */
export default function Page() {
    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                {/* Background Image*/}
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Abstract gradient background"
                        src="https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>

                {/* Sign-In Form Section */}
                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl">
                        
                        {/* Logo & Title*/}
                        <div className="flex items-center gap-3">
                            <a className="text-blue-600" href="#">
                                <span className="sr-only">Home</span>
                                <svg 
                                    width="40" 
                                    height="40" 
                                    viewBox="0 0 24 24" 
                                    className="text-[#00ffcc]"
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </a>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                                Welcome Back to AccuTrack
                            </h1>
                        </div>

                        {/* Subtitle*/}
                        <p className="mt-4 leading-relaxed text-gray-500">
                            Sign in to access your financial dashboard, manage expenses, track income, 
                            and stay on top of your business finances.
                        </p>

                        {/* Sign-In Form*/}
                        <div className="sign-in-container mt-6">
                            <SignIn
                                afterSignInUrl="/dashboard" // Redirect after successful sign-in
                                afterSignUpUrl="/dashboard" // Ensures users are redirected correctly
                                signUpUrl="/sign-up" 
                                appearance={{
                                    layout: {
                                        backgroundColor: "#ffffff",
                                        logoPlacement: "inside",
                                    },
                                    variables: {
                                        colorPrimary: "#000000",
                                        colorText: "#333333",
                                        colorInputBackground: "#ffffff",
                                        colorBackground: "#ffffff",
                                        colorInputBorder: "#dddddd",
                                    },
                                    elements: {
                                        card: "shadow-lg rounded-lg border border-gray-200 bg-white",
                                        formButtonPrimary: "bg-[#000000] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded",
                                        formFieldInput: "border border-gray-300 rounded px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500",
                                        socialButtonsBlockButton: "border border-gray-300 rounded px-4 py-2",
                                        footerActionText: "text-gray-600",
                                        footerActionLink: "text-blue-600 hover:underline"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
}
