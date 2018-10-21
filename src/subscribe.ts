// @ts-ignore
const SERVER_ADDRESS = process.env.SERVER_ADDRESS

/**
 * Establish WebSocket Connection with impuAddress in Query
 */
export default async function subscribe(impuAddress: string) {
  return new WebSocket(
    `ws://${SERVER_ADDRESS}?impuAddress=${encodeURIComponent(impuAddress)}`
  )
}
