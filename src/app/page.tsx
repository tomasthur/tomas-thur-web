"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Zoznam fotiek v galérii
const galleryImages = [
  "/images/img_1_1759985128608.jpg",
  "/images/img_1_1760877796318.jpg",
  "/images/img_3_1759985163994.jpg",
  "/images/img_4_1759985448468.jpg",
  "/images/img_5_1759985466009.jpg",
  "/images/img_6_1759985891989.jpg",
  "/images/img_7_1759986019355.jpg",
  "/images/img_8_1759986139899.jpg",
  "/images/img_9_1759986156749.jpg",
  "/images/img_10_1759986783636.jpg",
];

function Galeria() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (src: string, index: number) => {
    setSelectedImage(src);
    setSelectedIndex(index);
  };

  const closeImage = useCallback(() => {
    setSelectedImage(null);
    setSelectedIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < galleryImages.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedImage(galleryImages[nextIndex]);
      setSelectedIndex(nextIndex);
    }
  }, [selectedIndex]);

  const prevImage = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedImage(galleryImages[prevIndex]);
      setSelectedIndex(prevIndex);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!selectedImage) {
      document.body.style.overflow = "";
      return;
    }

    // Blokovať scroll keď je lightbox otvorený
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };

    // Swipe down na zatvorenie (mobile)
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      const swipeDistance = touchStartY - touchEndY;
      // Ak swipe down viac ako 100px, zatvor lightbox
      if (swipeDistance < -100) {
        closeImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.body.style.overflow = "";
    };
  }, [selectedImage, nextImage, prevImage, closeImage]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((src, index) => (
          <button
            key={index}
            onClick={() => openImage(src, index)}
            className="relative aspect-square overflow-hidden rounded-lg glass border border-white/10 hover:border-white/20 transition-all hover:scale-105 group"
          >
            <Image
              src={src}
              alt={`Galéria ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-4 touch-none"
          onClick={closeImage}
        >
          {/* Zatvoriť button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl sm:text-3xl hover:text-orange-400 transition-colors z-20 glass px-4 py-3 sm:px-3 sm:py-2 rounded-full touch-manipulation"
            onClick={(e) => {
              e.stopPropagation();
              closeImage();
            }}
            aria-label="Zavrieť"
          >
            ✕
          </button>

          {/* Predchádzajúci button */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl hover:text-orange-400 transition-colors z-20 glass px-3 py-3 sm:px-4 sm:py-3 rounded-full touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Predchádzajúci"
            >
              ‹
            </button>
          )}

          {/* Ďalší button */}
          {selectedIndex < galleryImages.length - 1 && (
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl hover:text-orange-400 transition-colors z-20 glass px-3 py-3 sm:px-4 sm:py-3 rounded-full touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Ďalší"
            >
              ›
            </button>
          )}

          {/* Počítadlo */}
          <div className="absolute top-4 left-4 text-white glass px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm z-20">
            {selectedIndex + 1} / {galleryImages.length}
          </div>

          {/* Obrázok */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`Galéria ${selectedIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

function KontaktnyFormular() {
  const [meno, setMeno] = useState("");
  const [email, setEmail] = useState("");
  const [sprava, setSprava] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meno,
          email,
          sprava: sprava || "Bez správy",
        }),
      });

      if (response.ok) {
        setStatus("success");
        setMeno("");
        setEmail("");
        setSprava("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="meno" className="block text-sm font-medium mb-2 text-white/80">
          Meno
        </label>
        <input
          type="text"
          id="meno"
          value={meno}
          onChange={(e) => setMeno(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          placeholder="Vaše meno"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          placeholder="vas@email.sk"
        />
      </div>

      <div>
        <label htmlFor="sprava" className="block text-sm font-medium mb-2 text-white/80">
          Správa (voliteľné)
        </label>
        <textarea
          id="sprava"
          value={sprava}
          onChange={(e) => setSprava(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
          placeholder="Vaša správa..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary rounded-full px-6 py-3 text-base font-medium shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Odosielam..." : "Odoslať"}
      </button>

      {status === "success" && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
          Správa bola úspešne odoslaná!
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
          Chyba pri odosielaní. Skúste to prosím znova.
        </div>
      )}
    </form>
  );
}

function MobilneMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Prevencia scrollu keď je menu otvorené - LEN NA MOBILE
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button - zobrazí sa len na mobile, skryje sa keď je menu otvorené */}
      <button
        onClick={toggleMenu}
        className={`sm:hidden flex flex-col gap-1.5 p-2 transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Menu"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile menu overlay - len za menu panelom */}
      <div
        className={`fixed inset-0 z-40 sm:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={closeMenu}
      >
        {/* Blur pozadie len za menu panelom */}
        <div
          className={`absolute top-0 right-0 h-full w-64 mobile-menu-overlay ${
            isOpen ? "overlay-open" : ""
          }`}
        />
      </div>
      
      {/* Menu panel - VŽDY renderované, len sa posúva */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 p-6 z-50 sm:hidden mobile-menu-nav ${
          isOpen ? "menu-open pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Tlačidlo X na zatvorenie */}
          <button
            onClick={closeMenu}
            className={`absolute top-6 right-6 text-white text-2xl hover:text-orange-400 transition-all duration-300 z-10 ${
              isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
            }`}
            aria-label="Zavrieť menu"
          >
            ✕
          </button>
          
          <div className="flex flex-col gap-6 mt-20">
            <a
              href="#o-mne"
              onClick={closeMenu}
              className={`text-white hover:text-orange-400 text-lg font-medium transition-all duration-300 py-2 transform ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? '0.1s' : '0s' }}
            >
              O mne
            </a>
            <a
              href="#moja-praca"
              onClick={closeMenu}
              className={`text-white hover:text-orange-400 text-lg font-medium transition-all duration-300 py-2 transform ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? '0.15s' : '0s' }}
            >
              Moja práca
            </a>
            <a
              href="#galeria"
              onClick={closeMenu}
              className={`text-white hover:text-orange-400 text-lg font-medium transition-all duration-300 py-2 transform ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? '0.2s' : '0s' }}
            >
              Galéria
            </a>
            <a
              href="#kontakt"
              onClick={closeMenu}
              className={`btn-primary rounded-full px-6 py-3 text-center font-medium shadow-lg mt-4 transition-all duration-300 transform ${
                isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-8 opacity-0 scale-95"
              }`}
              style={{ transitionDelay: isOpen ? '0.25s' : '0s' }}
            >
              Kontakt
            </a>
          </div>
        </nav>
    </>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Ak je scrollovaný obsah pod menu (viac ako 50px od vrchu)
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    // Skontrolovať aj pri načítaní
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hero-bg relative overflow-x-hidden max-w-full">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto w-full transition-all duration-300 ${
        isScrolled ? "glass-opaque" : "glass"
      }`}>
        <div className="flex items-center gap-3">
          <Image src="/logo-white.png" alt="Logo Tomáš Thúr" width={36} height={36} className="rounded-sm" />
          <span className="text-sm sm:text-base tracking-wide text-white/80 uppercase">Tomáš Thúr</span>
        </div>
        {/* Desktop menu */}
        <nav className="hidden sm:flex items-center gap-4">
          <a href="#o-mne" className="text-white/80 hover:text-white text-sm font-medium transition-colors">O mne</a>
          <a href="#moja-praca" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Moja práca</a>
          <a href="#galeria" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Galéria</a>
          <a href="#kontakt" className="btn-primary rounded-full px-5 py-2 text-sm font-medium shadow-lg">Kontakt</a>
        </nav>
        {/* Mobile menu */}
        <MobilneMenu />
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative flex items-center justify-center px-6 sm:px-10 pt-20 sm:pt-24">
        {/* Background name across the whole screen */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 md:z-0">
          <div className="max-w-[92vw] sm:max-w-[86vw] md:max-w-[78vw] lg:max-w-[72vw] xl:max-w-[68vw] 2xl:max-w-[62vw] w-full flex justify-center">
            <span className="bg-name-text select-none uppercase">Tomáš Thúr</span>
          </div>
        </div>

        {/* Subtitle "Moderátor" under the name */}
        <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none z-40 subtitle-layer">
          <span className="hero-subtitle text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.3em]">Moderátor</span>
        </div>

        {/* Centered photo and subtitle */}
        <div className="relative z-10 md:z-10 flex flex-col items-center justify-center text-center">
          <div className="relative w-full max-w-2xl mx-auto" style={{ height: "calc(100svh - 80px)" }}>
            <Image
              src="/ja.png"
              alt="Tomáš Thúr"
              width={800}
              height={1200}
              priority
              className="block select-none h-full w-auto mx-auto object-contain"
              style={{ 
                objectPosition: "center top",
                maxHeight: "calc(100svh - 80px)"
              }}
            />
            {/* Gradient fade na spodnej strane */}
            <div 
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: "40%",
                background: "linear-gradient(to bottom, transparent 0%, #0b0b0b 100%)"
              }}
            />
          </div>
        </div>
      </section>

      {/* O mne Section */}
      <section id="o-mne" className="min-h-screen relative flex items-center justify-center px-6 sm:px-10 py-20">
        <div className="max-w-4xl w-full relative z-10 mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 sm:mb-12 text-white">
            <span className="text-gradient">O mne</span>
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-white/90 text-base sm:text-lg leading-relaxed">
            <p className="text-xl sm:text-2xl font-semibold mb-6">
              Vitajte na mojom webe!
            </p>
            
            <p>
              Moje meno je <strong>Tomáš Thúr</strong>, mám 34 rokov a zhruba 15-ročné skúsenosti s moderovaním a prácou v médiách.
            </p>
            
            <p>
              Niekoľko rokov som pracoval ako moderátor spravodajstva v rádiu <strong>Vlna</strong>, v rádiu <strong>Anténa Rock</strong>, ale aj v televízii <strong>Lux</strong>.
            </p>
            
            <p>
              Aktuálne pracujem ako moderátor <strong>STVR</strong>, štvrtý rok Vás sprevádzam reláciou televízna <strong>Regina</strong>, ktorá sa vysiela v pondelok-štvrtok v priamom prenose na Dvojke.
            </p>
            
            <p>
              Okrem toho moderujem mnohé eventy. Zo spoluprác v poslednom období môžem spomenúť:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4 sm:ml-6">
              <li>Spišsské folklórne slávnosti</li>
              <li>Folklórne slávnosti Rejdová</li>
              <li>Margecianske fajnoty</li>
              <li>Žena z Marsu - séria talkshow s Michaelou Musilovou</li>
              <li>Otvorenie prvej analógovej simulovanej vesmírnej stanice vo hvezdárni v Rožňave</li>
              <li>Slávnostné valné zhromaždenie Východoslovenskej vodárenskej spoločnosti</li>
              <li>Vianočný večierok Východoslovenskej vodárenskej spoločnosti</li>
              <li>Mnoho dní obcí</li>
            </ul>
            
            <p>
              Zároveň spolupracujem aj so spoločnosťou <strong>Osobný údaj</strong>, ktorej nahrávam všetky školenia pre ich klientov.
            </p>
            
            <p className="text-lg sm:text-xl font-semibold mt-8">
              Budem sa tešiť, ak sa stretneme aj na Vašom podujatí.
            </p>
          </div>
        </div>
      </section>

      {/* Moja práca Section */}
      <section id="moja-praca" className="min-h-screen relative flex items-center justify-center px-6 sm:px-10 py-20">
        <div className="max-w-4xl w-full relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-16 text-white">
            <span className="text-gradient">Moja práca</span>
          </h1>
          
          <div className="space-y-12 text-white/90">
            {/* Médiá */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Médiá</h2>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">STVR</span>
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">Rádio Vlna</span>
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">Rádio Anténa Rock</span>
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">Televízia Lux</span>
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">Televízia Región</span>
                <span className="glass px-4 py-2 rounded-full text-sm sm:text-base">Osobný údaj - nahrávanie školení</span>
              </div>
            </div>

            {/* Podujatia */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Podujatia</h2>
              <ul className="space-y-3 text-base sm:text-lg leading-relaxed">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Spišsské folklórne slávnosti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Folklórne slávnosti Rejdová</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Margecianske fajnoty</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Žena z Marsu - séria talkshow s Michaelou Musilovou</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Otvorenie prvej analógovej simulovanej vesmírnej stanice vo hvezdárni v Rožňave</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Slávnostné valné zhromaždenie Východoslovenskej vodárenskej spoločnosti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Vianočný večierok Východoslovenskej vodárenskej spoločnosti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Dni obce Margecany</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Dni obce Veľký Folkmar</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>100 rokov dobrovoľného hasičstva v Jaklovciach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Výročie DHZ v Nálepkove</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1.5">•</span>
                  <span>Mnoho ďalších</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Galéria Section */}
      <section id="galeria" className="min-h-screen relative flex items-center justify-center px-6 sm:px-10 py-20">
        <div className="max-w-7xl w-full relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-16 text-white text-center">
            <span className="text-gradient">Galéria</span>
          </h1>
          <Galeria />
        </div>
      </section>

      {/* Kontakt Section */}
      <section id="kontakt" className="min-h-screen relative flex items-center justify-center px-6 sm:px-10 py-20">
        <div className="max-w-2xl w-full relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-16 text-white">
            <span className="text-gradient">Kontakt</span>
          </h1>
          
          <div className="space-y-10 text-white/90">
            {/* Telefón */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Telefón</h2>
              <a 
                href="tel:+421907394284" 
                className="text-2xl sm:text-3xl font-medium text-white hover:text-orange-400 transition-colors"
              >
                0907 394 284
              </a>
            </div>

            {/* Kontaktný formulár */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white">Napíšte mi</h2>
              <KontaktnyFormular />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 pb-10 max-w-7xl mx-auto w-full flex items-center justify-between text-white/50">
        <span className="text-xs uppercase">© {new Date().getFullYear()} Tomáš Thúr</span>
        <a className="text-xs hover:text-white/80" href="#gdpr">GDPR</a>
      </footer>
    </div>
  );
}
