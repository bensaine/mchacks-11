import Button from "./Button"
import Input from "./Input"

export const IntervieweeOnboardForm = () => {
	return <div>
        <h1>Interviewee Onboard Form</h1>
        <Input title={"First Name"} />
        <Input title={"Last Name"} />
        <Input title={"Email"} />
        <Input title={"Phone Number"} />
        <Input title={"LinkedIn"} />
        <Input title={"GitHub"} />
        <Input title={"Resume"} />
        <Button title="Submit" />
    </div>
}
