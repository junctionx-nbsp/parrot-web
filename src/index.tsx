import * as domLoaded from "dom-loaded"
import { h, render } from "preact"
import App from "./components/app"

let root: Element
const run = async () => {
  await domLoaded

  const container = document.querySelector("#container")
  if (!container) throw new Error("Container Element couldn't be found.")
  root = render(<App />, container, root)

  console.log("# Ready")
}

run()
