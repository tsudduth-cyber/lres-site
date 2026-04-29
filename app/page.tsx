"use client";
import React, { useEffect, useState } from "react";

const logo = "https://langrealestateservices.com/wp-content/uploads/2021/07/Lang-Real-Estate-noLLC-grey-01-01-01.svg";
const redLogo = "https://langrealestateservices.com/wp-content/uploads/2021/07/Lang-Real-Estate-noLLCMain-01-01.svg";

const team = [
  {
    name: "Philip M. Lang",
    role: "President",
  image: "/images/pl head.png"  },
  {
    name: "Kelly Z. Austin",
    role: "CFO",
  image: "/images/kelly head.png"
  },
  {
    name: "Matt Miller",
    role: "Vice President of Brokerage & Leasing",
    image: "/images/matt head.png",
  },
  {
    name: "Jon Vogt",
    role: "Director of Operations",
    image: "/images/jon head.png",
  },
  {
    name: "Maria Smith",
    role: "Senior Property Manager",
    image: "/images/Maria head.png",
  },
  {
    name: "Dani Clowers",
    role: "Senior Property Manager",
    image: "/images/dani head.png",
  },
  {
    name: "Evelyn Tiseth",
    role: "Senior Property Manager",
    image: "/images/evelyn head.png",
  },
  {
    name: "Nick Bloodgood",
    role: "Property Manager",
    image: "/images/nick head.png",
  },
];

const services = [
  {
    title: "Industrial Focus",
    subtitle: "Industrial specialists",
    copy: "Product knowledge, market timing, and hands-on execution for owners, buyers, tenants, sellers, and investors.",
   image: "/images/assetstrat.png",
  },
  {
    title: "Asset Strategy",
    subtitle: "Real estate into competitive assets",
    copy: "Acquisition, disposition, leasing, and property management aligned around immediate and long-term client value.",
   image: "/images/indust.png",
  },
  {
    title: "Client Commitment",
    subtitle: "Principle-driven representation",
    copy: "Clear communication, durable relationships, and practical execution designed to produce valuable portfolios.",
   image: "/images/clientcommit.png",
  },
];

const properties = [
  {
    city: "Dallas",
    type: "Industrial / Flex",
    size: "42,000 SF",
    label: "Design-forward adaptive reuse",
    image: "/images/property1.png",
  },
  {
    city: "Dallas",
    type: "Warehouse",
    size: "88,500 SF",
    label: "Last-mile logistics asset",
   image: "/images/property2.png",
  },
  {
    city: "Dallas",
    type: "Office / Industrial",
    size: "31,200 SF",
    label: "Owner-user opportunity",
    image: "/images/property3.png",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur text-center">
      <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-white/50 whitespace-nowrap">{label}</div>
    </div>
  );
}

function HeroSection() {
  return (
<div className="relative flex min-h-[92vh] w-full items-end overflow-hidden bg-zinc-900 px-6 pb-10 pt-28 md:px-10">      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/newesthero.mp4" type="video/mp4" />
      </video>
      <img
        src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80"
        alt="Industrial property fallback"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      <div className="absolute left-6 right-6 top-6 z-10 md:left-10 md:right-10">
        <div className="text-xs uppercase tracking-widest text-white/70">
          DFW + Houston • Industrial • Brokerage + Property Management
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col justify-end">
        <div className="flex max-w-4xl flex-col gap-2">
          <div className="text-4xl font-medium tracking-tight text-white md:text-6xl lg:text-7xl">Commercial Real Estate</div>
          <div className="whitespace-nowrap text-4xl font-medium tracking-tight text-white md:text-6xl lg:text-7xl">Integrated Service</div>
          <div className="text-4xl font-medium tracking-tight text-white md:text-6xl lg:text-7xl">Delivered Results</div>
        </div>

        <div className="mt-8 w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-white shadow-xl backdrop-blur-md">
          <div className="grid items-center gap-4 lg:grid-cols-[1.6fr_auto_1fr]">
            <p className="text-sm leading-6 text-white/75">
              Full-service commercial brokerage specializing in acquisition, disposition, leasing, and property management throughout Dallas-Fort Worth and Houston.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a href="#properties" className="rounded-full bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/30">
                View properties
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Stat value="9M+" label="Square Feet" />
              <Stat value="260+" label="Tenants" />
              <Stat value="20+" label="Years" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({
  city,
  type,
  size,
  label,
  image,
}: {
  city: string;
  type: string;
  size: string;
  label: string;
  image: string;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-zinc-300 bg-white shadow-sm shadow-zinc-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-80 overflow-hidden bg-zinc-900">
        <img
          src={image}
          alt={`${city} ${type}`}
className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent transition duration-500 group-hover:from-black/70 group-hover:via-black/20" />



        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="mb-4 h-px w-full bg-white/20 transition duration-300 group-hover:bg-red-500/70" />
          <p className="text-sm text-white/70">{type}</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <h3 className="text-3xl font-semibold tracking-tight text-white">{city}</h3>
            <span className="translate-y-2 text-sm font-semibold opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              View Details →
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-5">
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-500">{size}</p>
          <p className="mt-2 text-zinc-600">{label}</p>
        </div>
        <div className="h-10 w-10 rounded-full border border-zinc-200 text-center text-xl leading-9 text-zinc-400 transition group-hover:border-red-500 group-hover:text-red-600">
          +
        </div>
      </div>
    </div>
  );
}

export default function LangConcepts() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 560);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navShell = scrolled
    ? "border-zinc-200 bg-white/90 text-zinc-900 shadow-xl shadow-zinc-900/10"
    : "border-white/10 bg-white/10 text-white shadow-lg";

  const navSegment = scrolled
    ? "border-zinc-200 bg-zinc-100 text-zinc-700"
    : "border-white/10 bg-white/10 text-white/80";

  const navDivider = scrolled ? "border-zinc-200" : "border-white/10";
  const navHover = scrolled ? "hover:bg-zinc-200/70" : "hover:bg-white/10";
  const logoClass = scrolled ? "h-9 w-auto" : "h-9 w-auto brightness-0 invert";

  return (
    <main className="min-h-screen bg-[#eeeeec] text-zinc-900">
      <section className="relative overflow-hidden px-6 py-6 md:px-10 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2725] via-[#3a342f] to-[#4a443f]" />
        {/* bottom fade to transition into neutral page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[420px] bg-gradient-to-b from-transparent via-[#eeeeec]/55 to-[#eeeeec]" />

        <div className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-6 py-4 transition-all duration-300 md:px-10 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm shadow-zinc-900/5" : "bg-transparent"}`}>
        <nav className={`flex w-full max-w-7xl items-center justify-between rounded-2xl border px-5 py-4 backdrop-blur-xl transition-all duration-300 ${navShell}`}>
        <img src={scrolled ? redLogo : logo} alt="Lang Real Estate Services" className={logoClass} />
        <div className={`hidden items-center gap-6 text-xs font-medium uppercase tracking-widest md:flex`}>
          <a href="#firm" className={`transition relative ${navHover} after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-red-500 after:transition-all hover:after:w-full`}>Firm</a>
          <span className={`h-3 w-px ${navDivider}`} />
          <a href="#properties" className={`transition relative ${navHover} after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-red-500 after:transition-all hover:after:w-full`}>Properties</a>
          <span className={`h-3 w-px ${navDivider}`} />
          <a href="#team" className={`transition relative ${navHover} after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-red-500 after:transition-all hover:after:w-full`}>Team</a>
          <span className={`h-3 w-px ${navDivider}`} />
          <a href="#contact" className={`transition relative ${navHover} after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-red-500 after:transition-all hover:after:w-full`}>Contact</a>
        </div>
        <a href="#properties" className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30">View Properties</a>
        </nav>
      </div>

        <div className="relative z-10 mx-auto max-w-7xl pt-24 pb-20">
          <HeroSection />
        </div>
      </section>

      <section id="firm" className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3 md:px-10 bg-[#f5f5f3] text-zinc-900 rounded-[2rem] mt-10">
  {services.map((service, index) => {
    const items = [
      ["Acquisition advisory","Disposition strategy","Tenant representation"],
      ["Leasing execution","Portfolio strategy","Asset positioning"],
      ["Property management","Tenant relations","Operational oversight"],
    ][index];

    return (
      <div
        key={service.title}
        className="group relative min-h-[430px] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900 shadow-sm shadow-zinc-900/5 transition hover:shadow-xl"
      >
        {/* stock image */}
        <img
          src={service.image}
          alt={service.title}
className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/30 to-transparent transition duration-500 group-hover:from-white group-hover:via-white group-hover:to-white" />

        {/* visible title */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-7 text-center text-white transition duration-500 group-hover:opacity-0">
          <div className="mx-auto mb-5 h-px w-24 bg-red-500/70" />
          <h3 className="text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-red-500/80">{service.title}</h3>
        </div>

        {/* hover content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-7 text-center opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="mb-6 text-zinc-900">
            <h3 className="text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-red-500/80">{service.title}</h3>
            <p className="mx-auto mt-4 max-w-sm leading-7 text-zinc-600">
              {service.subtitle}. {service.copy}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {items.map((s) => (
              <div
                key={s}
                className="text-sm font-semibold text-zinc-800"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })}
</section>

      <section id="properties" className="mx-auto max-w-7xl rounded-[2.5rem] bg-white px-6 py-24 md:px-10 text-zinc-900">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Our Properties: Presented like assets</h2>
          </div>
          <a href="#" className="w-fit rounded-full border border-zinc-300 px-5 py-3 font-semibold text-zinc-700">View LoopNet listings ↗</a>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.35fr_.825fr_.825fr]">
          {properties.map((property) => (
            <PropertyCard key={`${property.city}-${property.type}`} {...property} />
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto max-w-7xl px-6 py-20 md:px-10 bg-[#f5f5f3] rounded-[2rem] mt-10">
        <div className="rounded-[2rem] border border-white/10 bg-white p-6 md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">Our Team: Experienced, focused, accountable</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <div key={person.name} className="group overflow-hidden rounded-2xl border border-zinc-300 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* stock headshot placeholder → replace with real portraits */}
                <div className="relative h-64 overflow-hidden bg-zinc-900">
                  <img
                    src={person.image}
                    alt={person.name}
className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 group-hover:brightness-105"                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent transition duration-500 group-hover:from-black/25" />
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-red-500/0 transition duration-300 group-hover:bg-red-500/70" />
                </div>

                {/* text */}
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-zinc-900">{person.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="rounded-[2rem] bg-white p-6 text-zinc-950 md:p-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <img src={redLogo} alt="Lang Real Estate Services" className="h-10 w-auto" />
              <p className="mt-5 max-w-xl text-zinc-600">6115 Owens Street, Suite 113, Dallas, TX 75235</p>
            </div>
            <div className="flex flex-col gap-3 text-sm font-semibold sm:flex-row">
              <a href="tel:9727446400" className="rounded-full bg-zinc-950 px-5 py-3 text-white">972.744.6400</a>
              <a href="mailto:info@langrealestateservices.com" className="rounded-full border border-zinc-200 px-5 py-3">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
