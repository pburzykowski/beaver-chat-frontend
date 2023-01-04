import { Text, Tabs } from "@mantine/core";
import SendMessagePanel from "../components/SendMessagePanel";
import MessagesReceivedPanel from "../components/MessagesReceivedPanel";
import ClientMessage from "../model/ClientMessage";
import { useState } from "react";
import ConversationTab from "./ConversationTab";

const ChatPanel = (props: any) => {

    const [selectedConversationWithUsername, setSelectedConversationWithUsername] = useState<string | null>(null);

    const converstationWithUsernames = Array.from(
        new Set([
            ...props.messages.map((message: ClientMessage) => message.fromUser),
            ...props.messages.map((message: ClientMessage) => message.toUser)]))
        .filter((user: string) => user !== props.usernameSignedIn)



    const includesUser = (message: ClientMessage, usernameSelected: String | null) => {
        return message.fromUser === usernameSelected || message.toUser == usernameSelected
    }

    const conversationTabs = converstationWithUsernames.map((username: string) => {
        const messagesInConversationCount = props.messages.filter((message: ClientMessage) => includesUser(message, username)).length
        const isSelected = selectedConversationWithUsername === username

        return <ConversationTab messagesCount={messagesInConversationCount} tabname={username} isSelected={isSelected} />
    })

    const selectedConversationMessages = props.messages.filter((message: ClientMessage) => includesUser(message, selectedConversationWithUsername))


    if (selectedConversationWithUsername === null && converstationWithUsernames.length > 0) {
        const firstConversationUsername = converstationWithUsernames[0]
        setSelectedConversationWithUsername(firstConversationUsername)
    }


    return (
        <>
            <Text mt={50}>You're logged in as: <b>{props.usernameSignedIn}</b></Text>
            <Tabs value={selectedConversationWithUsername} onTabChange={setSelectedConversationWithUsername}>
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