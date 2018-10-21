import { h, Component } from "preact"
import subscribe from "../subscribe"
import { IWebSocketPackage, ICallEvent } from "../types"
import { read } from "../utils/clipboard"
import Button from "preact-material-components/Button"

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

  public render() {
    const { phoneNumberValid, phoneNumber, text, inActiveCall } = this.state
    return (
      <div>
        <h1>Parrotify</h1>
        <div>
          <p>Phone Number</p>
          <input
            type="text"
            onChange={ev => this.setPhoneNumber(ev)}
            value={phoneNumber}
          />
          <Button onClick={() => this.setPhoneNumberFromClipboard()}>
            Paste
          </Button>
          <p>Text Input</p>
          <input type="text" onChange={ev => this.setText(ev)} value={text} />
          <Button onClick={() => this.setTextFromClipboard()}>Paste</Button>
          <Button
            enabled={phoneNumberValid && inActiveCall}
            onClick={() => this.sendToChat()}
          >
            Parrotify
          </Button>
        </div>
      </div>
    )
  }
}
