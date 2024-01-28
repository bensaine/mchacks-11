import React, { useEffect, createRef, useState, useRef } from "react"

export const MyStream = ({ stream, muted }) => {
	const ref = createRef()
	//   if (!stream) return <div></div>
	const updateVideoStream = () => {
		ref.current.srcObject = stream
	}
	useEffect(() => {
		updateVideoStream()
	}, [])

	return (
		<div
			style={{
				position: "fixed",
				bottom: 0,
				right: 0,
				width: "16rem",
				borderRadius: "0rem",
				borderTopRightRadius: "1rem",
				overflow: "hidden",
                lineHeight: 0,
				transform: "rotateY(180deg)",
			}}
		>
			<video autoPlay={true} id="videoElement" ref={ref} width={"100%"} muted={muted} />
		</div>
	)
}
