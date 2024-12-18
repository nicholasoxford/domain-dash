"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { User } from "@supabase/supabase-js";
import { testimonials, Testimonials } from "@/components/testimonials";
import { Pricing } from "./pricing";
import { DomainInquiriesSection } from "@/components/domain-inquiries-section";
import { Code, Server, Lock } from "lucide-react";
import { MessagesSquare, Zap, LineChart } from "lucide-react";

const FloatingOrb = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      x: [0, 50, 0],
      y: [0, -25, 0],
    }}
    transition={{
      duration: 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
  />
);

export function HomePage({ user }: { user: User | null }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-900 flex flex-col items-center justify-start antialiased">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-900" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} />
        <FloatingOrb delay={2} />
        <FloatingOrb delay={4} />
      </div>

      <motion.div
        className="fixed inset-0 opacity-50 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(300px at 0% 0%, purple 0%, transparent 80%)",
            "radial-gradient(300px at 100% 100%, purple 0%, transparent 80%)",
            "radial-gradient(300px at 0% 100%, purple 0%, transparent 80%)",
            "radial-gradient(300px at 100% 0%, purple 0%, transparent 80%)",
            "radial-gradient(300px at 0% 0%, purple 0%, transparent 80%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <div className="flex -space-x-2">
                {testimonials.map((person) => (
                  <div
                    key={person.name}
                    className="relative w-6 h-6 rounded-full shadow-sm"
                  >
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="24px"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-purple-200">
                Join 500+ Domain Owners
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-center mx-auto max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white leading-[1.1] tracking-tight mb-6">
            Put Your Domains
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              To Work
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Deploy landing pages in seconds. Get instant notifications for
            offers. Track everything in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              {user ? "Visit Dashboard" : "Add Your First Domain"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href={user ? "/docs" : "/demo"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg transition-colors border border-white/10"
            >
              {user ? "Documentation" : "See How It Works"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">$0</div>
              <div className="text-sm text-slate-400">To Start</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">5 Domain</div>
              <div className="text-sm text-slate-400">Free Forever</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
          </div>

          <Pricing user={user} />
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
            <Link
              href="/demo"
              className="relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-all duration-200"
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold text-white">
                  Try It Yourself
                </span>
                <span className="text-sm text-slate-400">
                  See our interactive offer form in action
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Testimonials />

          <DomainInquiriesSection />

          <div className="text-center bg-gradient-to-b from-slate-800/50 to-pink-900/20 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/10 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text mb-6">
              Streamlined Domain Inquiries
            </h2>

            <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
              Convert more visitors into buyers with our professional inquiry
              system. Automated responses, follow-ups, and analytics help you
              close deals faster.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: MessagesSquare,
                  title: "Instant Responses",
                  description:
                    "Auto-reply to every inquiry within seconds, keeping potential buyers engaged",
                },
                {
                  icon: Zap,
                  title: "Smart Follow-ups",
                  description:
                    "Automated email sequences nurture leads and increase conversion rates",
                },
                {
                  icon: LineChart,
                  title: "Offer Analytics",
                  description:
                    "Track engagement, analyze patterns, and optimize your pricing strategy",
                },
              ].map(({ icon: Icon, title, description }) => (
                <motion.div
                  key={title}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-slate-900/60 rounded-2xl p-6 border border-pink-500/10 group-hover:border-pink-500/20 transition-colors h-full">
                    <div className="bg-purple-500/10 rounded-xl w-full h-12 flex items-center justify-center mb-4 ring-1 ring-purple-500/20">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white text-xl mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-300">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative group mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <Link
                href="/managed"
                className="relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-pink-500/50 transition-all duration-200"
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold text-white">
                    Learn More About Managed Hosting
                  </span>
                  <span className="text-sm text-slate-400">
                    We take care of the hosting, so you don&apos;t have to.
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="text-center bg-gradient-to-b from-slate-800/50 via-indigo-900/20 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/10 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span className="animate-pulse w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">
                Coming Soon
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text mb-6">
              Domain Bobber Marketplace
            </h2>

            <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
              A curated marketplace for premium domains. Connect directly with
              serious buyers and sellers in our upcoming ecosystem.
            </p>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-black/40 rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      500+
                    </div>
                    <div className="text-sm text-slate-400">
                      Premium Domains
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      $2M+
                    </div>
                    <div className="text-sm text-slate-400">Total Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      50+
                    </div>
                    <div className="text-sm text-slate-400">
                      Verified Sellers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-b from-slate-800/50 to-purple-900/20 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/10 mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text mb-6">
              Self-Host Your Own Instance
            </h2>

            <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
              Take full control of your domain sales infrastructure. Our
              self-hosted solution gives you complete ownership and
              customization capabilities.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Code,
                  title: "Open Source",
                  description:
                    "Access the complete source code and customize it to your needs",
                },
                {
                  icon: Server,
                  title: "Your Infrastructure",
                  description:
                    "Deploy on your own servers with your preferred cloud provider",
                },
                {
                  icon: Lock,
                  title: "Data Ownership",
                  description:
                    "Keep full control of your data and user information",
                },
              ].map(({ icon: Icon, title, description }) => (
                <motion.div
                  key={title}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-slate-900/60 rounded-2xl p-6 border border-purple-500/10 group-hover:border-purple-500/20 transition-colors h-full">
                    <div className="bg-purple-500/10 rounded-xl w-full h-12 flex items-center justify-center mb-4 ring-1 ring-purple-500/20">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white text-xl mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-300">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/docs/self-host"
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30"
            >
              View Self-Hosting Guide
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
