const Frame1 = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f3ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "var(--f1-hero-width)",
        }}
      >
        <h1
          style={{
            fontFamily: '"Fanwood Text", serif',
            fontWeight: 400,
            color: "#2d2d2d",
            margin: 0,
            fontSize: "var(--f1-h1-size)",
            lineHeight: "var(--line-height-heading)",
          }}
        >
          I build systems that <span style={{ color: "#7a8b5c" }}>scale your business</span> while
          you sleep.
        </h1>
        <p
          style={{
            fontFamily: '"Fanwood Text", serif',
            fontWeight: 400,
            color: "#2d2d2d",
            marginBottom: 0,
            fontSize: "var(--f1-body-size)",
            lineHeight: "var(--line-height-body)",
            marginTop: "var(--f1-para-mt)",
            maxWidth: "var(--f1-hero-max-width)",
          }}
        >
          Hi, I'm Justin. I transform manual bottlenecks into automated growth engines. No robotic
          templates—just high-performance web experiences and agentic tools designed for humans.
        </p>
      </div>
    </section>
  );
};

export default Frame1;
