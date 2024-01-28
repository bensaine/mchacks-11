import { useState } from "react"
import Button from "./Button"
import Input from "./Input"
import { usePlayerStore } from "../hooks/usePlayerStore.jsx"
import UploadFile from "./UploadFile"

export const IntervieweeOnboardForm = () => {
    const {player, setPlayerStore} = usePlayerStore()
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [linkedIn, setLinkedIn] = useState("")
    const [gitHub, setGitHub] = useState("")
    const [resume, setResume] = useState("")


    const uploadResume = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append("file", resume)
        formData.append("uuid", player.id)
        const response = await fetch("https://flask-fairy-backend2-3uhbl4hveq-uc.a.run.app/upload", {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        console.log(data)
    }

    const handleSubmit = async () => {
        await uploadResume()
        setPlayerStore({...player, onboarded: true})
    }
    
    if (loading) {
        return <div>Loading...</div>
    }

	return <div>
        <h1>Interviewee Onboard Form</h1>
        <Input name="fname" title={"First Name"} onChange={setFirstName}/>
        <Input name="lname" title={"Last Name"} type="url" onChange={setLastName} />
        <Input name="email" title={"Email"} type="email" onChange={setEmail} />
        <Input name="phone" title={"Phone Number"} type="tel" onChange={setPhoneNumber} />
        <Input name="linkedin" title={"LinkedIn"} type="url" onChange={setLinkedIn}/>
        <Input name="github" title={"GitHub"} type={"url"} onChange={setGitHub}/>
        <UploadFile name="resume" title={"Resume"} onChange={setResume}/>
        <Button title="Submit" onClick={handleSubmit} />
    </div>
}
