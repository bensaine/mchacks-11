import { css } from "@emotion/react"
import "./App.css"
import { IntervieweeOnboardForm } from "../components/IntervieweeOnboardForm"

let wrapperStyle = css`
	
`

function App() {
	return (
		<div css={wrapperStyle}>
			<h1>Welcome to Fairy! 🧚</h1>
			<IntervieweeOnboardForm />
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	)
}

export default App
