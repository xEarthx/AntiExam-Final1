import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function MyParticles() {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: { value: "#0d0d0d" }
        },
        fpsLimit: 60,
        particles: {
          number: { value: 60 },
          color: { value: "#ffffff" },
          size: { value: 1 },
          move: {
            enable: true,
            speed: 0.3
          },
          opacity: {
            value: 0.5
          }
        },
        detectRetina: true
      }}
    />
  );
}
export default MyParticles;