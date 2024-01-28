import { io } from "socket.io-client"
const URL = "https://45.77.144.218"
export const socket = io(URL)
export default socket
