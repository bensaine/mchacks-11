import React, { useEffect, createRef, useState, useRef } from "react";
import { css } from "@emotion/react";
import { Insights, InsightsOther } from "./Insights";

const videoStreamsStyle = css`
  position: fixed;
  top: 0rem;
  left: 0rem;
  width: 60%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  z-index: 2;
`;

export const VideoStream = ({ stream, muted, info }) => {
  const ref = createRef();
  //   if (!stream) return <div></div>
  const updateVideoStream = () => {
    ref.current.srcObject = stream;
  };
  useEffect(() => {
    updateVideoStream();
  }, []);

  return (
    <div style={{ margin: 0, lineHeight: 0, overflow: "hidden" }}>
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

export const VideoStreams = ({ streams, infos }) => {
  return (
    <div css={videoStreamsStyle}>
      <div
        style={{
          width: "16rem",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        {Object.entries(streams).map(([id, stream]) => {
          return (
            <VideoStream
              key={id}
              stream={stream}
              info={id in infos ? infos[id] : null}
            />
          );
        })}
      </div>
    </div>
  );
};
