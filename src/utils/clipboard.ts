const nav = navigator as Navigator & {
  clipboard: {
    readText(): Promise<string>
    writeText(text: string): Promise<string>
  }
}

export async function read() {
  return nav.clipboard.readText()
}

export async function write(text: string) {
  return nav.clipboard.writeText(text)
}
