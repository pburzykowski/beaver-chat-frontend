import { Stack } from "@mantine/core";
import { ThemeProvider } from "./ThemeProvider";
import { useState } from 'react';
import SockJS from "sockjs-client"
import Stomp, { Client, Message } from "stompjs"
import ConnectPanel from "./components/ConnectPanel";
import State from "./model/State"
import ClientMessage from "./model/ClientMessage"
import ChatPanel from "./components/ChatPanel";
import ErrorNotification from "./components/ErrorNotification";

export default function App() {

  const [state, setState] = useState<State>({
    isConnected: false,
    isError: false
  })

  const [usernameSignedIn, setUsernameSignedIn] = useState<string | undefined>(undefined)
  const [client, setClient] = useState<Client | undefined>(undefined)
  const [clientMessages, setClientMessages] = useState<ClientMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  const connect = (username: string) => {

    if (isUsernameIncorrect(username)) {
      setState({ isConnected: false, isError: true })
      setErrorMessage("User name is incorrect")
      return
    }

    let socket = new SockJS('http://localhost:8080/hello')
    let stompClient = Stomp.over(socket);

    const onConnect = () => {
      setState({ isConnected: true, isError: false })
      setUsernameSignedIn(username)
      setClient(stompClient)

      stompClient.subscribe('/users/queue/messages', (message: Message) => {

        const clientMessage = JSON.parse(message.body) as ClientMessage
        setClientMessages((prev: ClientMessage[]) => [...prev, clientMessage])
      })
    }

    const onError = () => {

      if (!state.isConnected) {
        setErrorMessage("Could not connect to server")
      }

       //Todo it does not work, fix this
      if (state.isConnected) {
        setErrorMessage("Disconnected")
      }

      setState({ isConnected: false, isError: true })
      setUsernameSignedIn(undefined)
      setClient(undefined)
    }

    stompClient.connect({ username: username, }, onConnect, onError)

  }

  const isUsernameIncorrect = (username: string) => {
    return username === undefined || username === ""
  }

  const send = (message: string, toUsername: string) => {

    client?.send("/app/private-message", {}, JSON.stringify({ toUser: toUsername, payload: message }));
  }

  return (
    <ThemeProvider>
      <Stack align="center" spacing="xl">
        {state.isError ? <ErrorNotification message={errorMessage} /> : <></>}
        {!state.isConnected ? <ConnectPanel handleConnect={connect} /> : <></>}
        {state.isConnected ? <ChatPanel usernameSignedIn={usernameSignedIn} handleSend={send} messages={clientMessages} /> : <></>}
      </Stack>
    </ThemeProvider>
  );
}
