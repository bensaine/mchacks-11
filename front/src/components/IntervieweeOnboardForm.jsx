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
        const url = "https://flask-fairy-backend3-3uhbl4hveq-uc.a.run.app"
        const response = await fetch(url+"/upload", {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
        data.resume = url + "/uploads/" + player.id
        return data
    }

    const handleSubmit = async () => {
        uploadResume().then((playerStore) => {
           setPlayerStore({...player, 
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phoneNumber,
            linkedIn: linkedIn,
            gitHub: gitHub,
            onboarded: true, ...playerStore})
        }).then(() => {
            setLoading(false)
            window.location.href = "/room"
        })

    }
    
    if (player === undefined || loading) {
        return <div>Loading...</div>
    }

    if (player.onboarded) {
        window.location.href = "/room"
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
