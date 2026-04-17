'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Wand2, Code2, Eye } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const features = [
  { icon: Wand2, title: 'Prompt to Website', desc: 'Turn plain language into production-grade interfaces instantly.' },
  { icon: Code2, title: 'Code-First Editing', desc: 'Live-edit multi-file projects in Monaco with AI context.' },
  { icon: Eye, title: 'Real-time Preview', desc: 'See every token and style update rendered immediately.' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-hero-gradient">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="text-accent2" /> WebSite Builder AI</div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href={"/sign-in" as Route} className="rounded-full border border-white/20 px-4 py-2 text-sm">Sign in</Link>
            <Link href={"/builder" as Route} className="rounded-full bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-black">Get started</Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl"
        >
          Build complete websites with AI in seconds.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-white/80"
        >
          Premium AI website builder with chat, code editing, live preview, project history, and one-click export.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex gap-3">
          <Link href={"/builder" as Route} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:scale-105">
            Launch Builder <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-16 md:grid-cols-3">
        {features.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12 }}
            className="glass rounded-2xl p-6"
          >
            <item.icon className="mb-4 text-accent2" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-white/75">{item.desc}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-semibold">Simple pricing</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/15 p-6 text-left">
              <h3 className="text-xl font-medium">Free</h3>
              <p className="mt-3 text-sm text-white/70">Limited projects and generations for evaluation.</p>
            </div>
            <div className="rounded-2xl border border-accent/50 bg-accent/10 p-6 text-left shadow-glow">
              <h3 className="text-xl font-medium">Pro</h3>
              <p className="mt-3 text-sm text-white/70">Unlimited projects, faster model access, and full export workflows.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
