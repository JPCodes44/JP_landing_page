const Frame1 = () => {
  return (
    <section className="min-h-screen w-full bg-bg-warm">
      <nav
        className="sticky top-0 z-50 flex items-center justify-between h-[4.5rem] px-[3.75rem]"
        style={{
          backdropFilter: "blur(8px) saturate(1.58)",
          WebkitBackdropFilter: "blur(8px) saturate(1.58)",
          background: "transparent",
          boxShadow: "0 2px 2px rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <span className="font-fanwood text-[1.375rem] text-text-primary">Justin Mak.</span>
        <ul className="flex gap-10 list-none m-0 p-0">
          <li>
            <a
              href="#services"
              className="font-fanwood text-[1.3rem] font-normal text-text-primary no-underline hover:opacity-70"
            >
              services
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-fanwood text-[1.3rem] font-normal text-text-primary no-underline hover:opacity-70"
            >
              contact
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className="font-fanwood text-[1.3rem] font-normal text-text-primary no-underline hover:opacity-70"
            >
              experience
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="font-fanwood text-[1.3rem] font-normal text-text-primary no-underline hover:opacity-70"
            >
              about
            </a>
          </li>
        </ul>
      </nav>

      <div className="pl-[12%] pt-[10rem]">
        <h1 className="font-fanwood text-[5.375rem] font-normal leading-[1.1] text-text-primary max-w-[60vw]  m-0">
          I build systems that <span className="text-accent-green">scale your business</span> while
          you sleep.
        </h1>
        <p className="font-fanwood text-[1.9rem] font-normal leading-[1.6] text-text-primary mt-[5rem] max-w-[70vw] mb-0">
          Hi, I'm Justin. I transform manual bottlenecks into automated growth engines. No robotic
          templates—just high-performance web experiences and agentic tools designed for humans.
        </p>
      </div>
    </section>
  );
};

export default Frame1;
