document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const skillFills = document.querySelectorAll(".skill-bar-fill");
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Reveal sections + animate skill bars when visible
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.classList.add("visible");

          if (section.id === "skills") {
            skillFills.forEach(bar => {
              const level = bar.getAttribute("data-level");
              bar.style.width = level + "%";
            });
          }

          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach(sec => observer.observe(sec));

  // Simple bar chart in hero card (no libraries)
  const canvas = document.getElementById("skillChart");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    canvas.width = 360;
    canvas.height = 160;

    const skills = [
      { label: "SQL", value: 92 },
      { label: "Python", value: 88 },
      { label: "ML", value: 86 },
      { label: "BI Tools", value: 90 }
    ];

    const padding = 30;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / (skills.length * 1.6);
    const maxVal = 100;

    // Background
    ctx.fillStyle = "rgba(15,23,42,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Bars
    skills.forEach((skill, index) => {
      const x = padding + index * (barWidth * 1.6) + barWidth * 0.3;
      const barHeight = (skill.value / maxVal) * chartHeight;
      const y = padding + (chartHeight - barHeight);

      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, "#6366f1");
      gradient.addColorStop(1, "#ec4899");
      ctx.fillStyle = gradient;

      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + barHeight - radius);
      ctx.quadraticCurveTo(x, y + barHeight, x + radius, y + barHeight);
      ctx.lineTo(x + barWidth - radius, y + barHeight);
      ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth, y + barHeight - radius);
      ctx.lineTo(x + barWidth, y + radius);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
      ctx.closePath();
      ctx.fill();

      // Labels
      ctx.fillStyle = "rgba(229,231,235,0.95)";
      ctx.font = "10px Poppins";
      ctx.textAlign = "center";
      ctx.fillText(skill.label, x + barWidth / 2, canvas.height - 8);
      ctx.fillText(skill.value + "%", x + barWidth / 2, y - 6);
    });
  }
});
