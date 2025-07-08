"use client"

export function FloatingElements() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-pulse"></div>
            <div
                className="absolute top-40 right-20 w-16 h-16 bg-green-500/10 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute bottom-40 left-20 w-12 h-12 bg-blue-500/10 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute bottom-20 right-40 w-24 h-24 bg-purple-500/5 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
            ></div>
        </div>
    )
}
