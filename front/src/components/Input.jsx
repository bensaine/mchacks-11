import { css } from "@emotion/react"

const style = css`
	border-radius: 8px;
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-family: inherit;
	background-color: #1a1a1a;
	cursor: pointer;
	transition: border-color 0.25s;
	outline: none;
	border-color: transparent;

	&:hover,
	&:focus,
	&:focus-visible {
		border-color: #646cff;
	}
`

const labelStyle = css`
    font-size: 1em;
    font-family: inherit;
    color: #fff;
`

const divStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Input = ({ title, placeholder, onChange }) => {
	return (
		<div css={divStyle}>
			<label css={labelStyle} htmlFor={title}>{title}</label>
			<input name={title} css={style} type="text" placeholder={placeholder} onChange={onChange} />
		</div>
	)
}

export default Input
