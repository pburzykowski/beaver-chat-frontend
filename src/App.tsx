import { Stack } from "@mantine/core";
import { ThemeProvider } from "./ThemeProvider";
import { useRef, useState } from 'react';
import SockJS from "sockjs-client"
import Stomp, { Client, Frame, Message } from "stompjs"
import ConnectPanel from "./components/ConnectPanel";
import State from "./model/State"
import ClientMessage from "./model/ClientMessage"
import ChatPanel from "./components/ChatPanel";
import ErrorNotification from "./components/ErrorNotification";
import { NotificationsProvider } from '@mantine/notifications';
import { showNotification } from '@mantine/notifications';
import { IconX } from "@tabler/icons";

export default function App() {

  const [state, setState] = useState<State>({
    isConnected: false,
    isError: false
  })
  const stateRef = useRef<State>(state)

  const setRefState = (state:State) => {
      stateRef.current = state
      setState(state)
  }

  const [usernameSignedIn, setUsernameSignedIn] = useState<string | undefined>(undefined)
  const [client, setClient] = useState<Client | undefined>(undefined)
  const [clientMessages, setClientMessages] = useState<ClientMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  const connect = (username: string) => {

    if (isUsernameIncorrect(username)) {
      setRefState({ isConnected: false, isError: true })
      setErrorMessage("User name is incorrect")
      return
    }

    let socket = new SockJS('http://localhost:8080/hello')
    let stompClient = Stomp.over(socket);

    const onConnect = () => {
      setRefState({ isConnected: true, isError: false })
      setUsernameSignedIn(username)
      setClient(stompClient)

      stompClient.subscribe('/users/queue/messages', (message: Message) => {

        const clientMessage = JSON.parse(message.body) as ClientMessage
        setClientMessages((prev: ClientMessage[]) => [...prev, clientMessage])

      })
    }

    const onError = (error: Frame | string) => {
      const currentState = stateRef.current;
      if(!currentState.isConnected){
        setErrorMessage("Could not connect to server")
      }
      if(currentState.isConnected){
        setErrorMessage("Disconnected from server")
      }
      setClientMessages([])
      setUsernameSignedIn(undefined)
      setClient(undefined)

      setRefState({ isConnected: false, isError: true })
    }

    stompClient.connect({ username: username, }, onConnect, onError)

  }

  const isUsernameIncorrect = (username: string) => {
    return username === undefined || username === ""
  }


  const showErrorNotification = (errorMessage: string) => {
    return  showNotification({
      title: 'Error',
      color: 'red',
      icon: <IconX />,
      message: errorMessage,
      autoClose: 5000,
    });

  }
  const send = (message: string, toUsername: string) => {

    if(message.length === 0){
      showErrorNotification("Empty messages are not allowed!")
      return
    }

    if(usernameSignedIn === toUsername){
      showErrorNotification("Sending messages to yourself is not allowed!")
      return
    }

    client?.send("/app/private-message", {}, JSON.stringify({ toUser: toUsername, payload: message }));
  }

  return (

    <ThemeProvider>
      <NotificationsProvider>
        <Stack align="center" spacing="xl">
          {state.isError ? <ErrorNotification message={errorMessage} /> : <></>}
          {!state.isConnected ? <ConnectPanel handleConnect={connect} /> : <></>}
          {state.isConnected ? <ChatPanel usernameSignedIn={usernameSignedIn} handleSend={send} messages={clientMessages} /> : <></>}
        </Stack>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
