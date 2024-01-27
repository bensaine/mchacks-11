import { useState } from "react"
import "./App.css"
import { IntervieweeOnboardForm } from "../components/IntervieweeOnboardForm"

function App() {
	return (
		<>
			<h1>Welcome to Fairy! 🧚</h1>
			<IntervieweeOnboardForm />
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	)
}

export default App
