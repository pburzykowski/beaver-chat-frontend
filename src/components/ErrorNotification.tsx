import { IconX } from '@tabler/icons';
import { Notification } from "@mantine/core";

const ErrorNotification = (props: any) => {
    return (
        <Notification mt={25} icon={<IconX size={18} />} color="red">
            {props.message}
        </Notification>
    );
}

export default ErrorNotification;