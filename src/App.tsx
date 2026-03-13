/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Menu, X, Github, Twitter, Linkedin, 
  ExternalLink, Mail, Sun, Moon, Code2, Layout, 
  Zap, Globe, Cpu, Palette, Send 
} from 'lucide-react';

import { GeneratedImage } from './components/GeneratedImage';

type Section = 'landing' | 'about' | 'work' | 'contact';
type Theme = 'light' | 'dark';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems: { label: string; id: Section }[] = [
    { label: 'Home', id: 'landing' },
    { label: 'About', id: 'about' },
    { label: 'Work', id: 'work' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNav = (id: Section) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-[100dvh] font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-zinc-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => handleNav('landing')}
            className="text-2xl font-serif font-bold tracking-tighter hover:opacity-70 transition-opacity cursor-pointer"
          >
            ZYRO
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors cursor-pointer ${
                  activeSection === item.id 
                    ? 'text-red-600' 
                    : theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-zinc-800 text-yellow-400' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              className={`p-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-40 pt-24 px-6 md:hidden ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}
          >
            <div className="flex flex-col gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-4xl font-serif font-bold text-left ${
                    activeSection === item.id ? 'text-red-600' : theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activeSection === 'landing' && <LandingView onExplore={() => handleNav('work')} theme={theme} />}
          {activeSection === 'about' && <AboutView theme={theme} />}
          {activeSection === 'work' && <WorkView theme={theme} />}
          {activeSection === 'contact' && <ContactView theme={theme} />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-400 text-sm">© 2026 ZYRO. Built with passion by a Front-end Developer.</p>
          <div className="flex gap-6 text-zinc-400">
            <a href="https://t.me/@codex600" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="Telegram">
              <Send size={20} />
            </a>
            <a href="https://x.com/@zyroonchain" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingView({ onExplore, theme }: { onExplore: () => void; theme: Theme }) {
  return (
    <motion.section
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
    >
      {/* Modern Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-600 font-mono font-bold tracking-[0.3em] uppercase text-[10px]">
            Available for new projects
          </span>
          <div className="h-[1px] w-8 bg-red-600" />
        </div>

        <h1 className="text-7xl md:text-[10rem] font-serif font-bold tracking-tighter leading-[0.85] mb-12">
          Digital <br />
          <span className={`italic relative ${theme === 'dark' ? 'text-zinc-800' : 'text-zinc-100'}`}>
            Architect.
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute bottom-4 left-0 h-[4px] bg-red-600/20 -z-10"
            />
          </span>
        </h1>

        <div className="grid md:grid-cols-3 gap-12 items-center text-left mt-20">
          <div className="md:col-span-2">
            <p className={`text-xl md:text-2xl leading-tight font-medium max-w-xl ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`}>
              I engineer high-fidelity interfaces that bridge the gap between human emotion and digital precision.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <button 
              onClick={onExplore}
              className="bg-red-600 text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-red-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xl shadow-red-600/40 group"
            >
              Explore Artifacts <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className={`text-xs uppercase tracking-widest font-bold opacity-40 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Scroll to discover
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements for Modern Feel */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 right-[10%] w-32 h-32 border rounded-full opacity-10 ${theme === 'dark' ? 'border-white' : 'border-black'}`}
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-1/4 left-[5%] w-48 h-48 border rounded-3xl opacity-5 ${theme === 'dark' ? 'border-white' : 'border-black'}`}
      />
    </motion.section>
  );
}

function AboutView({ theme }: { theme: Theme }) {
  const skills = [
    { icon: <Code2 size={20} />, title: 'React & Next.js', desc: 'Building scalable SPAs and SSR applications with modern hooks and patterns.' },
    { icon: <Zap size={20} />, title: 'Performance', desc: 'Optimizing Core Web Vitals, lazy loading, and efficient state management.' },
    { icon: <Palette size={20} />, title: 'UI/UX Design', desc: 'Translating complex designs into pixel-perfect, responsive components.' },
    { icon: <Globe size={20} />, title: 'Accessibility', desc: 'Ensuring web experiences are inclusive and WCAG compliant.' },
  ];

  return (
    <motion.section
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
        <div className="order-2 lg:order-1">
          <h2 className="text-5xl font-serif font-bold mb-8">The Developer Behind Zyro</h2>
          <div className={`space-y-6 text-lg leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <p>
              I'm a Front-end Developer with a deep obsession for the intersection of design and technology. 
              My journey started with a simple "Hello World" and evolved into a career dedicated to crafting 
              high-performance digital products.
            </p>
            <p>
              I don't just write code; I architect experiences. Whether it's a complex dashboard or a 
              minimalist portfolio, I focus on the details that matter: speed, accessibility, and 
              emotional connection.
            </p>
            <p>
              Currently, I'm pushing the boundaries of what's possible with React, TypeScript, and 
              modern CSS, always seeking the perfect balance between aesthetic beauty and technical robustness.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-2">Tech Stack</h4>
              <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Framer Motion</li>
                <li>Node.js</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Tools</h4>
              <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <li>Figma</li>
                <li>VS Code</li>
                <li>Git / GitHub</li>
                <li>Vercel</li>
                <li>Chrome DevTools</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <GeneratedImage 
              prompt="A cinematic, moody, professional photograph of a modern minimalist developer workspace. A sleek monitor displaying React code, a mechanical keyboard, warm ambient desk lighting, dark background, highly detailed, 8k resolution, photorealistic."
              alt="Front-end Developer at work"
              className={`object-cover w-full h-full transition-all duration-700 ${theme === 'dark' ? 'brightness-75 grayscale-[0.2]' : ''}`}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-8 rounded-2xl hidden md:block">
            <p className="text-4xl font-serif font-bold">8+</p>
            <p className="text-xs uppercase tracking-widest opacity-80">Years of Experience</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-2xl border transition-all hover:border-red-600/50 ${
              theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'
            }`}
          >
            <div className="text-red-600 mb-4">{skill.icon}</div>
            <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
              {skill.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function WorkView({ theme }: { theme: Theme }) {
  const projects = [
    { 
      title: 'Quantum Analytics', 
      category: 'FinTech / Dashboard', 
      prompt: 'High-quality UI/UX design of a dark mode financial trading dashboard, glowing neon blue and green charts, data visualization, modern web design, sleek, dribbble style, 8k',
      desc: 'A high-frequency trading dashboard designed for institutional investors. Focused on real-time data streaming and complex visualization.',
      tags: ['React', 'D3.js', 'WebSockets', 'Tailwind'],
      year: '2025'
    },
    { 
      title: 'Aura Commerce', 
      category: 'E-Commerce / Luxury', 
      prompt: 'High-quality UI/UX design of a luxury fashion e-commerce website, minimalist, clean white background, elegant serif typography, editorial style, modern web design, dribbble style, 8k',
      desc: 'A headless commerce solution for a luxury fashion house. Optimized for sub-second page loads and immersive storytelling.',
      tags: ['Next.js', 'Shopify', 'Framer Motion', 'Radix UI'],
      year: '2024'
    },
    { 
      title: 'Nebula OS', 
      category: 'SaaS / Interface', 
      prompt: 'High-quality UI/UX design of a futuristic web-based operating system interface, glassmorphism, translucent floating windows, abstract glowing background, modern web design, dribbble style, 8k',
      desc: 'An experimental web-based operating system interface. Pushing the boundaries of browser-based window management and multitasking.',
      tags: ['TypeScript', 'Canvas API', 'Web Workers', 'Zustand'],
      year: '2025'
    },
    { 
      title: 'Zenith Health', 
      category: 'HealthTech / Mobile', 
      prompt: 'High-quality UI/UX design of a clean mobile health and wellness app interface, soft pastel colors, modern UI design, dribbble style, 8k',
      desc: 'A comprehensive wellness platform focusing on mental health and habit tracking. Built with a mobile-first, offline-ready architecture.',
      tags: ['React Native', 'PWA', 'Firebase', 'Lottie'],
      year: '2023'
    },
  ];

  return (
    <motion.section
      key="work"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <div className="mb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tighter">Selected <br />Artifacts.</h2>
            <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              A curated selection of digital products where I've pushed the limits of front-end engineering and user experience design.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-red-600 font-mono text-sm font-bold tracking-widest">EST. 2018</span>
            <div className={`h-[1px] w-32 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          </div>
        </motion.div>
      </div>

      <div className="grid gap-32">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`grid lg:grid-cols-12 gap-12 items-center group`}
          >
            {/* Image Container */}
            <div className={`lg:col-span-7 relative overflow-hidden rounded-3xl ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="aspect-[16/10] overflow-hidden">
                <GeneratedImage 
                  prompt={project.prompt} 
                  alt={project.title}
                  className={`object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105 ${theme === 'dark' ? 'brightness-75 contrast-125' : ''}`}
                />
              </div>
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  View Case Study <ExternalLink size={16} />
                </button>
              </div>
            </div>

            {/* Info Container */}
            <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-red-600 font-mono text-xs font-bold tracking-[0.3em] uppercase">{project.category}</span>
                <span className={`text-xs font-mono opacity-30 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{project.year}</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 group-hover:text-red-600 transition-colors duration-300">
                {project.title}
              </h3>
              
              <p className={`text-lg mb-8 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className={`flex items-center gap-3 font-bold text-sm uppercase tracking-widest group/btn ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <span className="relative">
                  Explore Project
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover/btn:w-full" />
                </span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-48 text-center"
      >
        <p className={`text-sm uppercase tracking-[0.4em] font-bold mb-8 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-300'}`}>
          More projects on request
        </p>
        <button className={`text-2xl md:text-4xl font-serif font-bold hover:text-red-600 transition-colors border-b-2 pb-2 ${
          theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          Archive 2018 — 2023
        </button>
      </motion.div>
    </motion.section>
  );
}

function ContactView({ theme }: { theme: Theme }) {
  return (
    <motion.section
      key="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-24 min-h-[80vh] flex flex-col justify-center"
    >
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-6xl md:text-8xl font-serif font-bold mb-12 leading-tight">
            Ready to <br />
            ship <span className="text-red-600 italic">excellence?</span>
          </h2>
          
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Collaborate with me</p>
              <a href="mailto:dev@zyro.design" className="text-2xl md:text-4xl font-serif hover:text-red-600 transition-colors flex items-center gap-4 group">
                dev@zyro.design 
                <div className="p-3 rounded-full border border-zinc-200 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
              </a>
            </div>
            
            <div className="flex gap-12">
              <div className="space-y-4">
                <p className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Social</p>
                <div className="flex flex-col gap-2">
                  <a href="https://t.me/@codex600" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-red-600 transition-colors">Telegram</a>
                  <a href="https://x.com/@zyroonchain" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-red-600 transition-colors">Twitter</a>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Location</p>
                <p className="text-lg">Remote / Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-10 rounded-3xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
          <h3 className="text-2xl font-serif font-bold mb-8">Send a quick message</h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-50">Your Name</label>
              <input 
                type="text" 
                className={`w-full p-4 rounded-xl border focus:outline-none focus:border-red-600 transition-colors ${
                  theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                }`}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-50">Email Address</label>
              <input 
                type="email" 
                className={`w-full p-4 rounded-xl border focus:outline-none focus:border-red-600 transition-colors ${
                  theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                }`}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold opacity-50">Message</label>
              <textarea 
                rows={4}
                className={`w-full p-4 rounded-xl border focus:outline-none focus:border-red-600 transition-colors ${
                  theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                }`}
                placeholder="Tell me about your project..."
              />
            </div>
            <button className="w-full bg-red-600 text-white py-5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
