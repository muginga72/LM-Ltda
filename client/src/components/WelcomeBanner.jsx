import React from "react";

const WelcomeBanner = () => {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "24px 12px",
        textAlign: "center",
      }}
    >
      {/* Brand colors pulled from the logo */}
      <style>
        {`
          :root {
            --lm-navy: #1f2a44;   /* deep navy */
            --lm-orange: #c85a1e; /* burnt orange */
          }
          .welcome-headline {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
            font-weight: 800;
            letter-spacing: 0.2px;
            line-height: 1.15;
            margin: 0 0 12px 0;
            font-size: clamp(2rem, 5vw, 3.5rem);
          }
          .welcome-subtitle {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
            font-weight: 500;
            color: var(--lm-navy);
            font-size: clamp(1rem, 2.5vw, 1.375rem);
            margin: 0 auto;
            max-width: 900px;
            opacity: 0.92;
          }
          .welcome-prefix {
            color: var(--lm-navy);
          }
          .welcome-brand {
            color: var(--lm-orange);
          }
        `}
      </style>

      <h1 className="welcome-headline">
        <span className="welcome-prefix">Welcome to</span>{" "}
        <span className="welcome-brand">LM Ltd</span>
      </h1>

      <p className="welcome-subtitle">
        Explore our mission, values, and what makes us different.
      </p>
    </section>
  );
};

export default WelcomeBanner;