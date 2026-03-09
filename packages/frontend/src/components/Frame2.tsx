import bellImg from "../../styles/assets/2d/visuals/bell.png";
import calendarImg from "../../styles/assets/2d/visuals/calendar.png";
import sliderImg from "../../styles/assets/2d/visuals/slider.png";
import tasksImg from "../../styles/assets/2d/visuals/tasks.png";
import temperatureImg from "../../styles/assets/2d/visuals/temperature.png";
import workflowImg from "../../styles/assets/2d/visuals/workflow.png";
import {
  FONT_SIZE_BODY,
  FONT_SIZE_SECTION_H2,
  FRAME2_DESC_MARGIN_LEFT,
  FRAME2_GAP,
  FRAME2_LEFT_FLEX,
  FRAME2_RIGHT_FLEX,
  GRID_GAP_X,
  GRID_GAP_X_WIDE,
  GRID_GAP_Y,
  ICON_SIZE,
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_HEADING,
  PARA_MARGIN_TOP_SM,
  PARA_MAX_WIDTH,
  SECTION_PADDING_BOTTOM_LG,
  SECTION_PADDING_TOP_LG,
  SECTION_PADDING_X,
} from "../theme";

const icons = [
  { src: sliderImg, alt: "slider" },
  { src: temperatureImg, alt: "temperature" },
  { src: workflowImg, alt: "workflow" },
  { src: bellImg, alt: "bell" },
  { src: calendarImg, alt: "calendar" },
  { src: tasksImg, alt: "tasks" },
];

const Frame2 = () => {
  return (
    <section
      className="min-h-screen w-full bg-bg-warm"
      style={{
        paddingTop: SECTION_PADDING_TOP_LG,
        paddingBottom: SECTION_PADDING_BOTTOM_LG,
        paddingLeft: SECTION_PADDING_X,
        paddingRight: SECTION_PADDING_X,
      }}
    >
      <div className="flex items-center" style={{ gap: FRAME2_GAP }}>
        <div className="min-w-0 flex flex-col" style={{ flex: FRAME2_LEFT_FLEX }}>
          <h2
            className="font-fanwood font-normal text-text-primary m-0"
            style={{
              fontSize: FONT_SIZE_SECTION_H2,
              lineHeight: LINE_HEIGHT_HEADING,
            }}
          >
            What I do:
          </h2>
          <div style={{ marginLeft: FRAME2_DESC_MARGIN_LEFT }}>
            <p
              className="font-fanwood font-normal text-text-primary mb-0"
              style={{
                fontSize: FONT_SIZE_BODY,
                lineHeight: LINE_HEIGHT_BODY,
                maxWidth: PARA_MAX_WIDTH,
                marginTop: PARA_MARGIN_TOP_SM,
              }}
            >
              I specialize in creating &ldquo;
              <span className="text-accent-green">agentic</span>&rdquo; workflows. That means your
              business doesn&rsquo;t just have tools; it has autonomous systems that handle lead
              gen, reporting, and customer care without you lifting a finger.
            </p>
          </div>
        </div>
        <div
          className="min-w-0 justify-center justify-items-center"
          style={{
            flex: FRAME2_RIGHT_FLEX,
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            columnGap: GRID_GAP_X_WIDE,
            rowGap: GRID_GAP_Y,
          }}
        >
          {icons.map((icon) => (
            <img
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              style={{ width: "100%", maxWidth: ICON_SIZE, height: ICON_SIZE }}
              className="object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Frame2;
