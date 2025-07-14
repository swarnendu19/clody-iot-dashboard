import { useEffect } from "react";
import lottie from "lottie-web";

const StatusIndicator = ({ title, status, lottieSrc, color }) => {
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: document.getElementById(`lottie-${title}`),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: lottieSrc,
    });

    return () => anim.destroy();
  }, [lottieSrc, title]);

  return (
    <div className="rounded-xl p-4 card-gradient border border-gray-800 flex items-center">
      <div
        className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center mr-4`}
      >
        <div id={`lottie-${title}`} style={{ width: "40px", height: "40px" }}></div>
      </div>
      <div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className={`font-semibold text-${color}-400`}>{status}</div>
      </div>
    </div>
  );
};

export default StatusIndicator;
