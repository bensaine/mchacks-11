import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./pages/App.jsx"
import Canvas from "./components/Canvas.jsx"
import Call from "./components/Call.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path="room" element={<Canvas />} />
				<Route path="call" element={<Call />} />
			</Routes>
		</BrowserRouter>
)
