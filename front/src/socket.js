import { io } from "socket.io-client"

const URL = window.location.hostname === "careerfairy.club" ? "https://45.77.144.218" : "http://127.0.0.1:4000"
export const socket = io('http://127.0.0.1:4000')
export default socket
