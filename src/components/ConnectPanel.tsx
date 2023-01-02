import { useRef } from 'react';
import { TextInput, Button, Stack } from "@mantine/core";

const ConnectPanel = (props: any) => {
    
    const userNameRef = useRef<HTMLInputElement>(null);
    const connect = () =>{
        props.handleConnect(userNameRef.current?.value)
    }

    return (
        <Stack align="center" spacing="xs" mt={50}>
            <TextInput ref={userNameRef} label="Your username" />
            <Button onClick={connect}>Connect</Button>
        </Stack>
    );
}

export default ConnectPanel;