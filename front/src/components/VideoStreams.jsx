import React, { useEffect, createRef, useState, useRef } from "react";


export const VideoStream = ({ stream,muted }) => {
  const ref = createRef();
  //   if (!stream) return <div></div>
  const updateVideoStream = () => {
    ref.current.srcObject = stream;
  };
  useEffect(() => {
    updateVideoStream();
  }, []);

  return (
    <div style={{margin: 0, lineHeight: 0, overflow: "hidden"}}>
      <video
        autoPlay={true}
        id="videoElement"
        ref={ref}
        width="300"
        muted={muted}
        // height="300"
      />
    </div>
  );
};


export const VideoStreams = ({ streams }) => {
  return (
    <div>
      {Object.entries(streams).map(([id, stream]) => {
        return <VideoStream key={id} stream={stream} />;
      })}
    </div>
  );
};
