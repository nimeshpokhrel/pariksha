import React from "react";
import { FaCheck } from "react-icons/fa";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

export default function QuestionSelector({
  subjects,
  questionSelectorCount,
  jumpToQuestion,
  userAnswers,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Question Selector</Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent top={8} maxW="640px">
          <ModalHeader>Select Question To Jump </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mt-4 flex w-full flex-col gap-8 pb-6">
              {subjects.map((subject, index) => {
                return (
                  <div className="w-full" key={index}>
                    <p className="mb-4 font-semibold">{subject.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {subject.questions.map((question, idx) => {
                        const questionNumber =
                          idx + 1 + index * questionSelectorCount > 100
                            ? idx + 1 + index * questionSelectorCount - 10
                            : idx + 1 + index * questionSelectorCount;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              jumpToQuestion(questionNumber);
                              onClose();
                            }}
                            className="h-10 w-14 rounded bg-gray-100 px-2 py-1 text-gray-800 hover:bg-gray-200"
                          >
                            {Object.hasOwn(userAnswers, question._id) ? (
                              <FaCheck className="w-full" />
                            ) : (
                              questionNumber
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
