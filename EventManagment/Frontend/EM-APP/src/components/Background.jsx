import React from 'react';
import Dither from '../reactbits/Dither'; // Adjust the path if needed

const Background = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Background;
