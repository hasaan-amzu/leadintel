import Link from "next/link";

function Nav() {
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Lead<span className="text-primary-600">Intel</span>
        </span>
        <Link
          href="/order"
          className="rounded-md bg-primary-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          AI-Powered Research on
          <br />
          <span className="text-primary-600">Every Prospect</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Upload your lead list. We research each prospect using web search,
          LinkedIn data, and AI synthesis — then deliver a detailed Excel report
          straight to your inbox.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/order"
            className="rounded-md bg-primary-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Research My Leads
          </Link>
          <a
            href="#how-it-works"
            className="rounded-md px-8 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-50"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: "1",
    title: "Upload Your Leads",
    desc: "Drop a CSV with name, company, and LinkedIn URL. We accept up to 100 leads per order.",
    icon: (
      <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "We Research Everything",
    desc: "Our AI pipeline runs web search, extracts page content, scrapes LinkedIn activity, and synthesizes a research brief per lead.",
    icon: (
      <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Get Your Report",
    desc: "Receive a detailed Excel file in your inbox with company intel, pain signals, confidence scores, and source URLs for every lead.",
    icon: (
      <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
          Three simple steps — no accounts, no subscriptions, no lock-in.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                {s.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { title: "Company Intel", desc: "What they do, industry, key offerings, size & stage" },
  { title: "Prospect Profile", desc: "Role priorities, responsibilities, LinkedIn headline" },
  { title: "Pain Signals", desc: "Specific challenges backed by evidence from research data" },
  { title: "LinkedIn Activity", desc: "Recent posts, engagement patterns, professional summary" },
  { title: "Confidence Score", desc: "1-10 rating so you know which leads have the richest data" },
  { title: "Source URLs", desc: "Every claim linked back to its original source" },
];

function WhatYouGet() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          What You Get Per Lead
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
          Each lead in your report includes deep research across multiple data points.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-gray-200 bg-white px-5 py-5"
            >
              <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleOutput() {
  const sampleData = [
    {
      name: "Sarah Chen",
      company: "TechVault Solutions",
      industry: "Cloud Infrastructure (DevOps/SRE)",
      whatTheyDo: "Cloud-native infrastructure management for mid-market SaaS companies. Monitoring, optimization, and security across AWS, GCP, and Azure.",
      priorities: "Scaling engineering team for enterprise customers, maintaining 99.99% SLA, expanding multi-cloud Azure support.",
      pain: "Engineering hiring bottleneck limiting product velocity",
      evidence: "LinkedIn posts mention 12 open engineering roles. Careers page shows positions open 60+ days.",
      confidence: 9,
    },
    {
      name: "Marcus Rivera",
      company: "GreenPath Logistics",
      industry: "Sustainable Last-Mile Logistics",
      whatTheyDo: "Electric vehicle-based last-mile delivery network serving e-commerce brands. Carbon-neutral shipping with same-day delivery in 15 metros.",
      priorities: "Expanding to 10 new metros, reducing per-package cost by 15%, securing enterprise e-commerce contracts.",
      pain: "Fleet maintenance costs escalating with rapid EV expansion",
      evidence: "Q3 investor update: vehicle maintenance costs exceeded projections by 22%.",
      confidence: 8,
    },
    {
      name: "Dr. Priya Nair",
      company: "MindBridge Health",
      industry: "Digital Mental Health / Health Tech",
      whatTheyDo: "AI-powered therapist matching platform. Serves both B2C (direct patients) and B2B (employer mental health benefits).",
      priorities: "Securing Series B, scaling B2B employer benefits channel, achieving HITRUST certification.",
      pain: "Therapist supply shortage creating 2-3 week patient wait times",
      evidence: "LinkedIn post: 'the provider shortage is a crisis — our patients wait 2-3 weeks.' 25 open therapist positions.",
      confidence: 8,
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sample Output
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
          Here&apos;s what your Excel report looks like — real research, not generic filler.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr>
                <th colSpan={2} className="bg-[#D6E4F0] px-3 py-2 text-center text-[11px] font-semibold text-[#1F4E79]">Lead Info</th>
                <th colSpan={2} className="bg-[#E2EFDA] px-3 py-2 text-center text-[11px] font-semibold text-[#1F4E79]">Company Snapshot</th>
                <th className="bg-[#FCE4D6] px-3 py-2 text-center text-[11px] font-semibold text-[#1F4E79]">Prospect Role</th>
                <th colSpan={2} className="bg-[#FFF2CC] px-3 py-2 text-center text-[11px] font-semibold text-[#1F4E79]">Pain Signals</th>
                <th className="bg-[#F2F2F2] px-3 py-2 text-center text-[11px] font-semibold text-[#1F4E79]">Meta</th>
              </tr>
              <tr className="bg-[#1F4E79] text-white">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Company</th>
                <th className="px-3 py-2 font-medium">What They Do</th>
                <th className="px-3 py-2 font-medium">Industry</th>
                <th className="px-3 py-2 font-medium">Likely Priorities</th>
                <th className="px-3 py-2 font-medium">Pain Signal</th>
                <th className="px-3 py-2 font-medium">Evidence</th>
                <th className="px-3 py-2 font-medium text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((d, i) => (
                <tr key={d.name} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-3 py-3 font-medium text-gray-900 align-top">{d.name}</td>
                  <td className="px-3 py-3 text-gray-700 align-top">{d.company}</td>
                  <td className="px-3 py-3 text-gray-600 align-top max-w-[200px]">{d.whatTheyDo}</td>
                  <td className="px-3 py-3 text-gray-600 align-top">{d.industry}</td>
                  <td className="px-3 py-3 text-gray-600 align-top max-w-[180px]">{d.priorities}</td>
                  <td className="px-3 py-3 text-gray-700 align-top max-w-[180px] font-medium">{d.pain}</td>
                  <td className="px-3 py-3 text-gray-500 align-top max-w-[200px] italic">{d.evidence}</td>
                  <td className="px-3 py-3 text-center align-top">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      d.confidence >= 8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {d.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Showing 3 of 26 columns. Full report includes LinkedIn intel, key offerings, additional pain signals with evidence, data gaps, and source URLs.
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Research Your Leads?
        </h2>
        <p className="mt-3 text-gray-500">
          No account needed. Upload your CSV, pay once, and get results in your inbox.
        </p>
        <Link
          href="/order"
          className="mt-8 inline-block rounded-md bg-primary-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} LeadIntel by AMZU Consulting. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <SampleOutput />
      <CTA />
      <Footer />
    </>
  );
}
