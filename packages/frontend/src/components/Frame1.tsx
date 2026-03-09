import {
  FONT_SIZE_BODY,
  FONT_SIZE_HERO_H1,
  HERO_MAX_WIDTH,
  HERO_WIDTH,
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_HEADING,
  PARA_MARGIN_TOP,
} from "../theme";

const Frame1 = () => {
  return (
    <section className="min-h-screen w-full bg-bg-warm flex items-center justify-center">
      <div className="flex flex-col" style={{ width: HERO_WIDTH }}>
        <h1
          className="font-fanwood font-normal text-text-primary m-0"
          style={{
            fontSize: FONT_SIZE_HERO_H1,
            lineHeight: LINE_HEIGHT_HEADING,
          }}
        >
          I build systems that <span className="text-accent-green">scale your business</span> while
          you sleep.
        </h1>
        <p
          className="font-fanwood font-normal text-text-primary mb-0"
          style={{
            fontSize: FONT_SIZE_BODY,
            lineHeight: LINE_HEIGHT_BODY,
            marginTop: PARA_MARGIN_TOP,
            maxWidth: HERO_MAX_WIDTH,
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
