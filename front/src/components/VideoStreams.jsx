import React, { useEffect, createRef, useState, useRef } from "react";
import { css } from "@emotion/react";


const videoStreamsStyle = css`
  position:fixed:
  top:0rem;
  left:0rem;
  width: 75%;
  display:flex;
  flex-direction:row;
  flex-wrap: wrap;
  align-items:center
  justify-content:start;
`

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
        height="300"
      />
    </div>
  );
};


export const VideoStreams = ({ streams }) => {
  return (
    <div css={videoStreamsStyle}>
        <div>
        {Object.entries(streams).map(([id, stream]) => {
          return <VideoStream key={id} stream={stream} />;
        })}
      </div>
    </div>
    
  );
};
