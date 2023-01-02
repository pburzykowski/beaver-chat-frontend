import { useRef } from 'react';
import { Text, TextInput, Button, Stack, Container, Group, Flex } from "@mantine/core";

const SendMessagePanel = (props: any) => {

    const userNameRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLInputElement>(null);

    const send = () => props.handleSend(messageRef.current?.value, userNameRef.current?.value)

    return (
        <Stack align="center" spacing="xs">
            <TextInput ref={userNameRef} label="Send to user:" />
            <Flex justify="center" align="center" direction="row">
                <TextInput ref={messageRef} />
                <Button onClick={send}>Send</Button>
            </Flex>

        </Stack>
    );
}

export default SendMessagePanel