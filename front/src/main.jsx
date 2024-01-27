import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./pages/App.jsx"
import Canvas from "./components/Canvas.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path="room" element={<Canvas />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)
