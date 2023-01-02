import { Text, ScrollArea, Stack, Paper } from "@mantine/core";
import ClientMessage from "../model/ClientMessage";


const MessagesReceivedPanel = (props: any) => {

    const messages = props.messages.map((message: ClientMessage) => <Text>[{message.time}][{message.fromUser}]: {message.payload}</Text>)

    return (
        <>
            <Paper shadow="xs" radius="xs" p="xs" withBorder>
                <ScrollArea mt={50} style={{ height: 300, width: 600 }} type="always">
                    <Stack>{messages}</Stack>
                </ScrollArea>
            </Paper>
        </>

    );  
}

export default MessagesReceivedPanel;