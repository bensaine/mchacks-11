import { css } from "@emotion/react"
import "./App.css"
import { IntervieweeOnboardForm } from "../components/IntervieweeOnboardForm"

let wrapperStyle = css``

function App() {
	return (
		<div css={wrapperStyle}>
			<h1>Welcome to CareerFairy! 🧚</h1>
			<IntervieweeOnboardForm />
			<p className="read-the-docs">Get that game face ready! Time to shine.</p>
		</div>
	)
}

export default App
