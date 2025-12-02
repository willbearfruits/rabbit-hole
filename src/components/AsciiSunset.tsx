import React, { useState, useEffect } from 'react';

export const AsciiSunset = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 2);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simple wave animation
  const wave1 = frame === 0 ? "~~~~~~~~~~~~~~": "~ ~ ~ ~ ~ ~ ~ ";
  const wave2 = frame === 0 ? "~ ~ ~ ~ ~ ~ ~ ": "~~~~~~~~~~~~~~";

  return (
    <div className="font-mono text-xs md:text-sm leading-none text-center select-none pointer-events-none text-orange-500">
      <pre className="inline-block text-left">

      \   |   /
    .  \  |  /  .
  .     \ | /     .
.   .    \|/    .   .
      .--'''--.
{wave1}|{frame === 0 ? "   O   " : "   o   "}|{wave1}
{wave2}|_______|{wave2}

      </pre>
      <div className="mt-4 font-bold text-xl md:text-3xl tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        The Rabbit Hole
      </div>
    </div>
  );
};
