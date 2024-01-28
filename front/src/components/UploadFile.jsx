import { css } from "@emotion/react"

const style = css`
	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-family: inherit;
	background-color: #1a1a1a;
	cursor: pointer;
	width: 100%;
	transition: border-color 0.25s;
	outline: none;
	border-color: transparent;
	box-sizing: border-box;

	&:hover,
	&:focus,
	&:focus-visible {
		border-color: #646cff;
	}
`

const labelStyle = css`
	font-size: 1em;
	font-family: inherit;
	padding: 0.5rem;
	color: #fff;
`

const divStyle = css`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
    flex-grow: 1;
`

const UploadFile = ({ onChange }) => {
	return (
		<div css={divStyle}>
			<label css={labelStyle} htmlFor="file">
				Resume
			</label>
			<input
				css={style}
				type="file"
				name="file"
				id="file"
				accept=".pdf"
				onChange={(e) => {
					onChange(e.target.files[0])
				}}
			/>
		</div>
	)
}

export default UploadFile
