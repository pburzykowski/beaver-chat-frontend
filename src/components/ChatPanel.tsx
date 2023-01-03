import { Text, Tabs } from "@mantine/core";
import SendMessagePanel from "../components/SendMessagePanel";
import MessagesReceivedPanel from "../components/MessagesReceivedPanel";
import ClientMessage from "../model/ClientMessage";
import { useState } from "react";
import ConversationTab from "./ConversationTab";

const ChatPanel = (props: any) => {

    const [usernameSelected, setUsernameSelected] = useState<string | null>(null);

    const converstationsWithUsers = Array.from(
        new Set([
            ...props.messages.map((message: ClientMessage) => message.fromUser),
            ...props.messages.map((message: ClientMessage) => message.toUser)]))
        .filter((user: string) => user !== props.usernameSignedIn)


    const conversationTabs = converstationsWithUsers.map((username: string) => {
        const messagesInConversationCount = props.messages.filter((message: ClientMessage) => message.fromUser === username || message.toUser === username ).length
        const isActiveTab = usernameSelected === username 

        return <ConversationTab messagesCount={messagesInConversationCount} username={username} isActiveTab={isActiveTab}  />
    })

    const selectedConversationMessages = props.messages.filter((message: ClientMessage) =>
    message.fromUser === usernameSelected || (message.fromUser === props.usernameSignedIn && message.toUser == usernameSelected));


    if (usernameSelected === null && converstationsWithUsers.length > 0) {
        const firstUser = converstationsWithUsers[0]
        setUsernameSelected(firstUser)
    }


    return (
        <>
            <Text mt={50}>You're logged in as: <b>{props.usernameSignedIn}</b></Text>
            <Tabs value={usernameSelected} onTabChange={setUsernameSelected}>
                <Tabs.List>
                    {conversationTabs}
                </Tabs.List>
            </Tabs>
            <MessagesReceivedPanel messages={selectedConversationMessages} />
            <SendMessagePanel handleSend={props.handleSend} />
        </>
    );
}

export default ChatPanel;