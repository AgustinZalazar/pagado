"use client"

import { useEffect, useRef, useState } from "react"
import { DollarSign, TrendingUp, PiggyBank, CreditCard, Wallet, Target, BarChart3, LineChart } from "lucide-react"

export function SophisticatedHeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Financial icons for floating animation
    const financialIcons = [
        { Icon: DollarSign, x: 10, y: 20, speed: 0.5, size: 24 },
        { Icon: TrendingUp, x: 80, y: 60, speed: 0.3, size: 28 },
        { Icon: PiggyBank, x: 20, y: 80, speed: 0.4, size: 26 },
        { Icon: CreditCard, x: 90, y: 30, speed: 0.6, size: 22 },
        { Icon: Wallet, x: 60, y: 10, speed: 0.35, size: 25 },
        { Icon: Target, x: 30, y: 50, speed: 0.45, size: 23 },
        { Icon: BarChart3, x: 70, y: 85, speed: 0.55, size: 27 },
        { Icon: LineChart, x: 40, y: 70, speed: 0.25, size: 24 },
    ]

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Particle system
        const particles: Array<{
            x: number
            y: number
            vx: number
            vy: number
            size: number
            opacity: number
            color: string
        }> = []

        // Create particles with blue color scheme
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`, // Blue spectrum
            })
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw animated gradient mesh with blue tones
            const gradient = ctx.createRadialGradient(
                mousePosition.x,
                mousePosition.y,
                0,
                mousePosition.x,
                mousePosition.y,
                canvas.width,
            )
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.15)") // Blue-500
            gradient.addColorStop(0.3, "rgba(37, 99, 235, 0.1)") // Blue-600
            gradient.addColorStop(0.6, "rgba(29, 78, 216, 0.08)") // Blue-700
            gradient.addColorStop(1, "rgba(30, 64, 175, 0.03)") // Blue-800

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw and update particles
            particles.forEach((particle) => {
                particle.x += particle.vx
                particle.y += particle.vy

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = particle.color.replace("60%)", `${particle.opacity})`)
                ctx.fill()

                // Draw connections between nearby particles
                particles.forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 100)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            requestAnimationFrame(animate)
        }

        animate()

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [mousePosition.x, mousePosition.y])

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Canvas for particle system */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Animated gradient blobs with blue theme */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/20 to-blue-700/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating financial icons with parallax */}
            <div className="absolute inset-0">
                {financialIcons.map((item, index) => {
                    const { Icon } = item
                    return (
                        <div
                            key={index}
                            className="absolute animate-float opacity-10 hover:opacity-30 transition-opacity duration-300"
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                                animationDelay: `${index * 0.5}s`,
                                animationDuration: `${3 + item.speed * 2}s`,
                                transform: `translate(-50%, -50%) translateZ(0)`,
                            }}
                        >
                            <Icon
                                size={item.size}
                                className="text-blue-500/20 drop-shadow-sm"
                                style={{
                                    filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))",
                                }}
                            />
                        </div>
                    )
                })}
            </div>

            {/* Animated grid overlay with blue tint */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "50px 50px",
                        animation: "gridMove 20s linear infinite",
                    }}
                />
            </div>

            {/* Floating geometric shapes with blue theme */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/20 rotate-45 animate-spin-slow"></div>
                <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-cyan-500/20 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-8 bg-indigo-500/20 animate-bounce"></div>
                <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-blue-600/20 rotate-12 animate-ping"></div>
            </div>

            {/* Morphing shapes with blue gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full animate-morph"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-indigo-500/10 to-blue-600/10 rounded-full animate-morph-reverse"></div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(180deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes morph {
          0%,
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg);
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(180deg);
          }
        }

        @keyframes morph-reverse {
          0%,
          100% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(180deg);
          }
          50% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-morph-reverse {
          animation: morph-reverse 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    )
}
