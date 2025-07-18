import { useState, useEffect } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-20"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold neon-text mb-2">
              Real-Time Soil Monitoring Dashboard
            </h1>
            <p className="text-cyan-200 opacity-80">
              Monitoring soil conditions in real-time
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center mr-6">
              <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2 pulse"></div>
              <span className="text-sm">Live Data</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-200">Last Updated</div>
              <div className="font-mono">{currentTime}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
