import { h, Component } from "preact"
import subscribe from "../subscribe"
import { IWebSocketPackage, ICallEvent } from "../types"
import { read } from "../utils/clipboard"
import Button from "preact-material-components/Button"
import "preact-material-components/Button/style.css"
import "preact-material-components/Theme/style.css"
import Typography from "preact-material-components/Typography"
import "preact-material-components/Typography/style.css"
import Card from "preact-material-components/Card"
import "preact-material-components/Card/style.css"
import Fab from "preact-material-components/Fab"
import "preact-material-components/Fab/style.css"

interface IState {
  text: string
  phoneNumber: string
  phoneNumberValid: boolean
  inActiveCall: boolean
}

// tslint:disable:no-magic-numbers

export default class ParrotifyWeb extends Component<{}, IState> {
  private websocketConnection?: WebSocket

  public state = {
    text: "",
    phoneNumber: "",
    phoneNumberValid: false,
    inActiveCall: false
  }

  private async setText(text: string | Event) {
    if (text instanceof Event) {
      text = (text.target as HTMLInputElement).value
    }
    this.setState({ text })
  }

  private async setPhoneNumber(str: string | Event) {
    if (str instanceof Event) {
      str = (str.target as HTMLInputElement).value
    }

    const phoneNumber = str.replace(/\s/g, "")

    // Validate
    const phoneNumberValid =
      phoneNumber.startsWith("sip:+") &&
      phoneNumber.length > 7 &&
      phoneNumber.length < 50
    this.setState({ phoneNumber, phoneNumberValid })

    console.log(
      `Phone Number entered: ${phoneNumber}, valid: ${phoneNumberValid}`
    )
    if (phoneNumberValid) {
      // Remove previous WebSocket Connection
      if (this.websocketConnection) {
        this.websocketConnection.close()
      }

      const ws = await subscribe(phoneNumber)
      ws.onmessage = messageEvent => {
        const { data } = messageEvent
        console.log(`Received WebSocket Data: ${data}`)
        const { callEvent }: IWebSocketPackage = JSON.parse(data.toString())
        if (callEvent === ICallEvent.CalledNumber)
          this.setState({ inActiveCall: true })
      }
      ws.onclose = ({ code, reason }) => {
        console.log(`WebSocket Connection closing: ${code} | ${reason}`)
        this.setState({ inActiveCall: false })
      }
      this.websocketConnection = ws
    }
  }

  private async sendToChat() {
    const { text } = this.state
    const ws = this.websocketConnection
    if (!ws) throw new ReferenceError("WebsocketConnection not assigned")
    ws.send(text)
  }

  private async setPhoneNumberFromClipboard() {
    const contents = await read()
    this.setPhoneNumber(contents)
  }

  private async setTextFromClipboard() {
    const contents = await read()
    const { text } = this.state
    this.setState({ text: text + contents })
  }
  // <Card.Media className="card-media" />
  public render() {
    const { phoneNumberValid, phoneNumber, text, inActiveCall } = this.state
    return (
      <div id="content">
        <Card>
          <div>
            <Typography class="center" headline1>Parrotify</Typography>
          </div>
          <div class="fill">
            <input
              type="text"
              placeholder="sip:+123456@example.com"
              onChange={ev => this.setPhoneNumber(ev)}
              value={phoneNumber}
            />
          </div>
          <div class="fill">
            <textarea
              // @ts-ignore
              multiline={true}
              placeholder={"Text Input"}
              class="mdl-textfield__input" type="text" onChange={ev => this.setText(ev)} value={text}></textarea>
          </div>
          <Card.Actions>
            <Card.ActionButton raised ripple onClick={() => this.setPhoneNumberFromClipboard()}>Paste Phone Number</Card.ActionButton>
            <Card.ActionButton raised ripple onClick={() => this.setTextFromClipboard()}>Paste Text</Card.ActionButton>
          </Card.Actions>
        </Card>
        <Fab disabled={!phoneNumberValid && !inActiveCall} onClick={() => this.sendToChat()} ripple={true}>{/*}Fab.Icon>favorite_border</Fab.Icon><img src="./parrot.png" />*/"🐦"}</Fab>
      </div >
    )
  }
}
