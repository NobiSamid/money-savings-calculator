import React, { useEffect, useState } from "react";

const MoneySavingsCalculator = () => {
  const [money, setMoney] = useState(0);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [addCount, setAddCount] = useState({ 10: 0, 50: 0, 100: 0 });
  const [subCount, setSubCount] = useState({ 10: 0, 50: 0, 100: 0 });

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          setMoney((prevMoney) => {
            const newMoney = next % 3 === 0 ? prevMoney - 30 : prevMoney + 50;
            playSound();
            triggerAnimation();
            return newMoney;
          });
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  const resetCalculator = () => {
    setRunning(false);
    setSeconds(0);
    setMoney(0);
  };

  const addMoney = (amount) => {
    setMoney((prev) => prev + amount);
    setAddCount((prev) => ({ ...prev, [amount]: prev[amount] + 1 }));
    playSound();
    triggerAnimation();
  };

  const subtractMoney = (amount) => {
    setMoney((prev) => prev - amount);
    setSubCount((prev) => ({ ...prev, [amount]: prev[amount] + 1 }));
    playSound();
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - button.offsetLeft}px`;
    ripple.style.top = `${e.clientY - button.offsetTop}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleButtonClick = (e, action) => {
    handleRipple(e);
    action();
  };

  const playSound = () => {
    if (isMuted) return; // Do not play if muted
    const audio = new Audio("/beep-07a.wav");
    audio.play().catch((e) => console.warn("Sound play failed:", e));
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <style>
        {`
          .ripple {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
          }

          @keyframes ripple-animation {
            to {
              transform: translate(-50%, -50%) scale(4);
              opacity: 0;
            }
          }

          .ripple-container {
            position: relative;
            overflow: hidden;
          }
        `}
      </style>
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Money Savings Calculator</h1>
        <p className="text-lg">
          Time Running: <strong>{seconds}</strong> seconds
        </p>
        <p
          className={`text-xl font-semibold mt-2 transition-transform duration-300 \${animate ? 'text-green-600 scale-110' : 'text-green-600'}`}
        >
          ${money}
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg rounded-xl ripple-container relative"
            onClick={(e) => handleButtonClick(e, () => setRunning(!running))}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="bg-yellow-500 hover:bg-red-600 text-white py-3 px-6 text-lg rounded-xl ripple-container relative"
            onClick={(e) => handleButtonClick(e, resetCalculator)}
          >
            Reset
          </button>
        </div>

        <div className="mt-6 flex gap-4 justify-center flex-wrap">
          {[10, 50, 100].map((amount) => (
            <button
              key={`add-\${amount}`}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 text-lg rounded-xl ripple-container relative"
              onClick={(e) => handleButtonClick(e, () => addMoney(amount))}
            >
              Add ${amount}
            </button>
          ))}

          {[10, 50, 100].map((amount) => (
            <button
              key={`sub-\${amount}`}
              className="bg-red-500 hover:bg-yellow-600 text-white py-3 px-6 text-lg rounded-xl ripple-container relative"
              onClick={(e) => handleButtonClick(e, () => subtractMoney(amount))}
            >
              Subtract ${amount}
            </button>
          ))}
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={toggleMute}
      >
        {isMuted ? "Unmute Sound 🔇" : "Mute Sound 🔊"}
      </button>
      <div className="mt-6 text-left bg-white p-4 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Usage Stats:</h2>
        <ul className="space-y-1 text-gray-700">
          {[10, 50, 100].map((amount) => (
            <li key={amount}>
              ➕ Added ${amount}: {addCount[amount]} times
              <br />➖ Subtracted ${amount}: {subCount[amount]} times
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoneySavingsCalculator;
