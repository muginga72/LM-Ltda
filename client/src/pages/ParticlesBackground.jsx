import React, { useEffect, useRef } from 'react';

function ParticlesBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.6 + 0.2
    }));

    const neon = '#00f5ff';

    function draw() {
      c.clearRect(0, 0, width, height);

      // subtle gradient backdrop for extra depth
      const g = c.createRadialGradient(width * 0.7, height * 0.2, 50, width * 0.7, height * 0.2, Math.max(width, height));
      g.addColorStop(0, 'rgba(0, 245, 255, 0.08)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = g;
      c.fillRect(0, 0, width, height);

      // lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            c.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist / 110)})`;
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(p.x, p.y);
            c.lineTo(q.x, q.y);
            c.stroke();
          }
        }
      }

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = `rgba(0,245,255,${p.a})`;
        c.shadowColor = neon;
        c.shadowBlur = 12;
        c.fill();
        c.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    />
  );
}

export default ParticlesBackground;