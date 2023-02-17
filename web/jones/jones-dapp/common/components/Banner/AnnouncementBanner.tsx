import { Alert, Box, Text } from "@chakra-ui/react";

import { Announcement } from "../../store/feedbackComponents/announcementBannerConfig";

export const AnnouncementBanner = (
  { title, action, secondaryAction }: Announcement,
  index: number,
) => (
  <Alert
    key={index}
    h={{ base: "auto", md: 12 }}
    bg="alert.300"
    color="white"
    fontSize="xs"
    experimental_spaceX={{ base: 0, md: 4 }}
    experimental_spaceY={{ base: 2, md: 0 }}
    display="flex"
    flexDir={{ base: "column", md: "row" }}
    justifyContent="center"
  >
    <Text fontWeight="semibold">Announcement</Text>
    <Text>{title}</Text>
    <Box minW="fit-content" experimental_spaceX={{ base: 0, md: 4 }}>
      {action}
      {secondaryAction}
    </Box>
  </Alert>
);
