import { Text, Tabs } from "@mantine/core";
import SendMessagePanel from "../components/SendMessagePanel";
import MessagesReceivedPanel from "../components/MessagesReceivedPanel";
import ClientMessage from "../model/ClientMessage";

const ChatPanel = (props: any) => {

    const messagesFromUsers = Array.from(new Set(props.messages.map((message: ClientMessage) => message.fromUser)))
    const messagesFromUsersTab = messagesFromUsers.map( (user: any) => <Tabs.Tab value="first">{user}</Tabs.Tab>)

    return (
        <>
            <Text mt={50}>You're logged in as: <b>{props.username}</b></Text>
            <Tabs>
                <Tabs.List>
                    {messagesFromUsersTab}
                </Tabs.List>
            </Tabs>
            <MessagesReceivedPanel messages={props.messages} />
            <SendMessagePanel handleSend={props.handleSend} />
        </>
    );
}

export default ChatPanel;