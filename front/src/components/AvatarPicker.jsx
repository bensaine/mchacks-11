import { css } from "@emotion/react"
import { useState } from "react"

const style = css`
	position:fixed;
	display:flex;
	flex-direction:column;
	align-items:start;
	top:0.5rem;
	left:0.5rem;
	z-index = 2;
	padding:1rem;
	border-radius: 1rem;
	background-color: #242424;
`

const styleTransparent = css`
	position:fixed;
	display:flex;
	flex-direction:column;
	align-items:start;
	top:0rem;
	left:0rem;
	z-index = 2;
	padding:1rem;
	border-radius: 1rem;
	background-color: #24242400;
`

const buttonStyle = css`
	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	background-color: #1a1a1a;
	cursor: pointer;
	color:white;
	transition: border-color 0.25s;

	&:hover {
		border-color: #646cff;
	}

	&:focus,
	&:focus-visible {
		outline: 4px auto -webkit-focus-ring-color;
	}
	margin:0.2rem;
`

const rowStyle = css`
	display:flex;
	width:100%;
	flex-direction:row;
	align-items:center;
	justify-content:start;
`

const textStyle = css`
	margin-left:1rem;
	font-weight:bold;
`	

function AvatarPicker({ onChosen }){

	const [openState, setOpenState] = useState(false)

	if (!openState){
		return <div css={styleTransparent}>
			<button css={buttonStyle} onClick={()=>{setOpenState(!openState)}}>
				Change Avatar
			</button>
		</div>
	} else {
		return <div css={style}>
			<div css={rowStyle}>
				<button css={buttonStyle} onClick={()=>{setOpenState(!openState)}}>
					<img src="/x-circle.svg" ></img>
				</button>
				<p css={textStyle}>Choose an avatar</p>
			</div>
			<div css={rowStyle}>
				<button css={buttonStyle} onClick={()=>{onChosen("heart_eyes")}}>
					<img src="/emojis/heart_eyes.svg" ></img>
				</button>
				<button css={buttonStyle} onClick={()=>{onChosen("smile")}}>
					<img src="/emojis/smile.svg" ></img>
				</button>
				<button css={buttonStyle} onClick={()=>{onChosen("star_struck")}}>
					<img src="/emojis/star_struck.svg" ></img>
				</button>
				<button css={buttonStyle} onClick={()=>{onChosen("sunglasses")}}>
					<img src="/emojis/sunglasses.svg" ></img>
				</button>
			</div>
		</div>
	}
}

export default AvatarPicker