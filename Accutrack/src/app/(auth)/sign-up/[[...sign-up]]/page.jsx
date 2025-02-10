import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
                alt=""
                src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="absolute inset-0 h-full w-full object-cover"
            />
            </aside>

            <main
            className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
            >
            <div className="max-w-xl lg:max-w-3xl">
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
                        Welcome to AccuTrack
                    </h1>
                </div>


                <p className="mt-4 leading-relaxed text-gray-500">
                Ready to simplify your business finances? 
                With AccuTrack, managing your expenses, income, taxes, and inventory has never been easier. 
                Join us today and discover how our platform can transform your financial management into a seamless process.
                
                </p>

                <div className="sign-up-container">
                        <SignUp />
                </div>
            </div>
            </main>
        </div>
        </section>
    )
}