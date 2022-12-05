import { Modal, Center, Button, Input, FormControl, Pressable, Flex, Divider } from 'native-base';
import React, { useState } from 'react';
const TimeSelectModal = (props: { showModal: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Center>
      <Pressable
        onPress={() => setShowModal(true)}
        mt="4"
        bg="info.900"
        w="300"
        h="50"
        rounded="xl">
        <Flex direction="row" h="50">
          <Center
            flex="3"
            _text={{
              fontSize: '2xl',
              color: 'white',
            }}>
            2022/11/11
          </Center>
          <Divider bg="#0A1E45" orientation="vertical" />
          <Center
            flex="2"
            _text={{
              fontSize: '2xl',
              color: 'white',
            }}>
            11:11
          </Center>
        </Flex>
      </Pressable>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        overlayVisible
        closeOnOverlayClick
        backdropVisible>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>選擇出發時間</Modal.Header>
          <Modal.Body />
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default TimeSelectModal;
