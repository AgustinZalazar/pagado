import React from 'react'

const FloatingElements = () => (
    <>
        {/* Large floating circles with blue tones */}
        <div
            className="absolute top-10 left-5 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl"
            style={{
                animation: "float 6s ease-in-out infinite",
            }}
        ></div>
        <div
            className="absolute bottom-20 right-8 w-40 h-40 bg-sky-400/25 rounded-full blur-2xl"
            style={{
                animation: "float 8s ease-in-out infinite reverse",
            }}
        ></div>
        <div
            className="absolute top-1/3 right-4 w-24 h-24 bg-cyan-400/35 rounded-full blur-xl"
            style={{
                animation: "float 7s ease-in-out infinite 2s",
            }}
        ></div>
        <div
            className="absolute bottom-1/3 left-2 w-36 h-36 bg-indigo-400/20 rounded-full blur-2xl"
            style={{
                animation: "float 9s ease-in-out infinite 1s",
            }}
        ></div>

        {/* Financial Icons - Dollar Signs */}
        <div
            className="absolute top-16 left-16 text-2xl text-blue-500/60 font-bold"
            style={{
                animation: "bounce 3s ease-in-out infinite",
            }}
        >
            $
        </div>
        <div
            className="absolute bottom-32 right-20 text-xl text-sky-500/70 font-bold"
            style={{
                animation: "bounce 4s ease-in-out infinite 1s",
            }}
        >
            $
        </div>
        <div
            className="absolute top-1/2 left-8 text-lg text-cyan-500/60 font-bold"
            style={{
                animation: "pulse 3s ease-in-out infinite 0.5s",
            }}
        >
            $
        </div>

        {/* Credit Card Shapes */}
        <div
            className="absolute top-24 right-12 w-12 h-8 bg-gradient-to-r from-blue-500/40 to-sky-500/40 rounded-md"
            style={{
                animation: "wiggle 4s ease-in-out infinite",
            }}
        ></div>
        <div
            className="absolute bottom-40 left-20 w-10 h-6 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-md"
            style={{
                animation: "wiggle 5s ease-in-out infinite 2s",
            }}
        ></div>

        {/* Coin Shapes */}
        <div
            className="absolute top-32 left-1/3 w-6 h-6 bg-gradient-to-r from-blue-600/50 to-sky-600/50 rounded-full border-2 border-blue-400/30"
            style={{
                animation: "spin 8s linear infinite",
            }}
        ></div>
        <div
            className="absolute bottom-28 right-1/4 w-8 h-8 bg-gradient-to-r from-cyan-600/40 to-blue-600/40 rounded-full border-2 border-cyan-400/30"
            style={{
                animation: "spin 12s linear infinite reverse",
            }}
        ></div>

        {/* Chart/Graph Elements */}
        <div
            className="absolute top-20 right-24 flex items-end space-x-1"
            style={{
                animation: "pulse 4s ease-in-out infinite",
            }}
        >
            <div className="w-1 h-4 bg-blue-500/60 rounded-t"></div>
            <div className="w-1 h-6 bg-sky-500/60 rounded-t"></div>
            <div className="w-1 h-3 bg-cyan-500/60 rounded-t"></div>
            <div className="w-1 h-7 bg-blue-500/60 rounded-t"></div>
        </div>
        <div
            className="absolute bottom-36 left-12 flex items-end space-x-1"
            style={{
                animation: "pulse 5s ease-in-out infinite 1s",
            }}
        >
            <div className="w-1 h-5 bg-sky-500/50 rounded-t"></div>
            <div className="w-1 h-3 bg-blue-500/50 rounded-t"></div>
            <div className="w-1 h-6 bg-cyan-500/50 rounded-t"></div>
        </div>

        {/* Percentage Symbols */}
        <div
            className="absolute top-40 left-24 text-lg text-blue-500/70 font-bold"
            style={{
                animation: "bounce 3.5s ease-in-out infinite 0.5s",
            }}
        >
            %
        </div>
        <div
            className="absolute bottom-24 right-16 text-sm text-sky-500/60 font-bold"
            style={{
                animation: "bounce 4.2s ease-in-out infinite 1.5s",
            }}
        >
            %
        </div>

        {/* Trend Arrows */}
        <div
            className="absolute top-28 right-32 text-blue-500/60"
            style={{
                animation: "bounce 3s ease-in-out infinite",
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5z" />
            </svg>
        </div>
        <div
            className="absolute bottom-32 left-32 text-cyan-500/60"
            style={{
                animation: "bounce 4s ease-in-out infinite 2s",
            }}
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5z" />
            </svg>
        </div>

        {/* Animated financial lines */}
        <div
            className="absolute top-36 right-8 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
            style={{
                animation: "slide 5s ease-in-out infinite",
            }}
        ></div>
        <div
            className="absolute bottom-44 left-16 w-12 h-0.5 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
            style={{
                animation: "slide 6s ease-in-out infinite 2s",
            }}
        ></div>

        {/* Bank/Building silhouettes */}
        <div
            className="absolute top-44 left-4 w-4 h-8 bg-blue-500/30 rounded-t-sm"
            style={{
                animation: "pulse 6s ease-in-out infinite",
            }}
        >
            <div className="w-full h-1 bg-blue-600/40 mt-1"></div>
            <div className="w-full h-1 bg-blue-600/40 mt-1"></div>
        </div>
        <div
            className="absolute bottom-16 right-4 w-3 h-6 bg-sky-500/40 rounded-t-sm"
            style={{
                animation: "pulse 7s ease-in-out infinite 1s",
            }}
        >
            <div className="w-full h-0.5 bg-sky-600/50 mt-1"></div>
        </div>
    </>
)

export default FloatingElements