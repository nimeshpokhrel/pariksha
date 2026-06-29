"use client";

import { useEffect, useState } from "react";

import { createContext, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { MdOutlineIosShare } from "react-icons/md";

const PwaInstallContext = createContext();

export function PwaInstallProvider({ children }) {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = () => {
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  const installButtonClick = () => {
    if (supportsPWA) {
      onClick();
    } else {
      onOpen();
    }
  };

  return (
    <PwaInstallContext.Provider
      value={{
        pwaInstall: installButtonClick,
        supportsPWA,
      }}
    >
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
        <ModalOverlay />
        <ModalContent marginX={"8px"}>
          <ModalHeader>Instructions To Install App</ModalHeader>
          <Divider colorScheme="green" />
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-6 mt-2 flex flex-col px-2">
              <h4 className="mb-8 text-center text-xl font-bold">
                Check if you have already installed Pariksha app.
              </h4>
              <h3 className="mb-1 text-lg font-semibold">
                For Desktop & Laptop
              </h3>
              <p>Please use Google Chrome to install Pariksha.</p>
              <h3 className="mb-2 mt-8 text-lg font-semibold">
                For IOS Devices.
              </h3>
              <ol style={{ listStyleType: "decimal" }} className="ml-8">
                <li className="mb-3">
                  <p>
                    While viewing the website, tap&nbsp;
                    <MdOutlineIosShare
                      size={"18"}
                      style={{ display: "inline" }}
                    />
                    &nbsp;in the menu bar.
                  </p>
                </li>
                <li>
                  <p className="mb-4">
                    Scroll down the list of options, then tap Add to Home
                    Screen.
                  </p>
                  <p>
                    If you don’t see Add to Home Screen, you can add it. Scroll
                    down to the bottom of the list, tap Edit&nbsp;Actions, then
                    tap Add to Home Screen.
                  </p>
                </li>
              </ol>
              <p className="mt-4">
                The icon appears only on the device where you add it.
              </p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}
