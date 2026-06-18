import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 30;

function createParticle(W, H, scattered) {
  const lifetime = 9000 + Math.random() * 10000;
  return {
    x: Math.random() * W,
    y: scattered ? Math.random() * H : H + Math.random() * 60,
    vy: -(0.12 + Math.random() * 0.10),
    vx: (Math.random() - 0.5) * 0.08,
    size: 0.9 + Math.random() * 0.9,
    maxOpacity: 0.18 + Math.random() * 0.22,
    lifetime,
    age: scattered ? Math.random() * lifetime : 0,
  };
}

export const AmbientParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(W, H, true)
    );

    let rafId;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.age += 16;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.age / p.lifetime;
        let alpha;
        if (progress < 0.15) {
          alpha = (progress / 0.15) * p.maxOpacity;
        } else if (progress > 0.8) {
          alpha = ((1 - progress) / 0.2) * p.maxOpacity;
        } else {
          alpha = p.maxOpacity;
        }

        if (p.age >= p.lifetime || p.y < -10) {
          Object.assign(p, createParticle(W, H, false));
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
};
