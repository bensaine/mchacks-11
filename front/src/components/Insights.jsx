export const InsightsOther = ({player}) => {
	if (!player) {
		return null
	}

	return <div style={{height : "100%"}}>
			<span style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
				<h3 style={{ fontSize: "1.2rem", padding: 0, margin: 0 }}>
					{player.firstName} {player.lastName}
				</h3>
				<span style={{ padding: "0.25rem 0.6rem", background: "#646cff", borderRadius: "1rem", fontWeight: "900", fontSize: "0.8rem" }}>
					{player.graduation} Grad
				</span>
			</span>
			<ul style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
				{player.insights && player.insights.map((insight, i) => {
					return (
						<li style={{ fontSize: "0.8rem", textAlign: "left" }} key={i}>
							{insight}
						</li>
					)
				})}
			</ul>
	</div>
}
export const Insights = ({ player, top, right }) => {
	// debugger
	if (!player) {
		return null
	}
	return (
		<div
			style={{
				background: "#242424",
				position: "absolute",
				top: 0,
				right: 0,
				borderBottomLeftRadius: "1rem",
				width: "20rem",
				maxWidth: "50%",
				padding: "1rem 0.5rem"
			}}
		>
			<span style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
				<h3 style={{ fontSize: "1.2rem", padding: 0, margin: 0 }}>
					{player.firstName} {player.lastName}
				</h3>
				<span style={{ padding: "0.25rem 0.6rem", background: "#646cff", borderRadius: "1rem", fontWeight: "900", fontSize: "0.8rem" }}>
					{player.graduation} Grad
				</span>
			</span>
			<ul style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
				{player.insights && player.insights.map((insight, i) => {
					return (
						<li style={{ fontSize: "0.8rem", textAlign: "left" }} key={i}>
							{insight}
						</li>
					)
				})}
			</ul>
			<a rel="noreferrer" className="lol" style={{padding: "0.25rem 0.6rem", background: "#646cff", color: "#fff", borderRadius: "1rem", fontWeight: "900", fontSize: "0.8rem" }} target="_blank" href={player.resume}>View Resume</a>

		</div>
	)
}
