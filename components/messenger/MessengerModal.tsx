import { Button, FormControl, FormHelperText, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'


function MessengerModal({ targetUserProfileId, isOpen, onClose }) {
    const initialRef = React.useRef(null)
    const toast = useToast()
    const [messageContent, setMessageContent] = useState('')
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/messenger', {
            method: 'POST',
            body: JSON.stringify({
                targetUserProfileId: targetUserProfileId,
                message: messageContent,
            }),
        })

        const { message } = await res.json()
        toast({
            title: message,
            status: res.status === 200 ? 'success' : 'error',
            duration: 4000,
            isClosable: true,
        })
        setMessageContent('') // clear the messageContent state
        onClose() // close the modal
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            initialFocusRef={initialRef}
            size={'lg'}
        >
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={e => onSubmitHandler(e)}>
                    <ModalHeader>Send a Message via Email</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Textarea
                                placeholder="Your message will be sent as an email. In App Message coming soon..."
                                value={messageContent}
                                name={'messageContent'}
                                onChange={(e) => { setMessageContent(e.target.value) }}
                                ref={initialRef}
                                rows={7}
                            />
                            <FormHelperText>
                                {"This will send the other user an email. Please be thoughtful about others inbox."}
                            </FormHelperText>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" ml={3} type="submit">
                            Send
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default MessengerModal

