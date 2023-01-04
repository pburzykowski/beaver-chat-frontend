import { Tabs, Indicator } from "@mantine/core";
import { useState } from "react";

const ConversationTab = (props: any) => {

    const [readMessages, setReadMessages] = useState<number>(0)
    const unreadMessages = props.messagesCount - readMessages

    const setReadAllMessages = () => {
        setReadMessages(props.messagesCount)
    }

    if(props.isSelected && unreadMessages > 0){
        setReadAllMessages()
    }


    return (
        <Indicator label={unreadMessages} showZero={false} dot={false} overflowCount={10} inline size={22}>
            <Tabs.Tab value={props.tabname} onClick={() => setReadAllMessages()}>{props.tabname}</Tabs.Tab>
        </Indicator>
    );
}

export default ConversationTab