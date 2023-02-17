import { FC } from "react";

import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";

import { Image } from "../Image";
import { JonesMenuButtons } from "./JonesMenuButtons";

export const JonesMenu: FC = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover onOpen={onOpen} onClose={onClose} isOpen={isOpen} autoFocus={false}>
      <PopoverTrigger>
        <IconButton
          variant="tertiary"
          size="lg"
          aria-label="jones-logo"
          icon={
            <Image src="/logo/jones-hat-gradient.svg" alt="jones-menu" width={20} height={20} />
          }
        />
      </PopoverTrigger>

      <PopoverContent bg="gray.800" border="0" borderRadius="xl" w="auto">
        <PopoverBody p={4}>
          <JonesMenuButtons />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
