import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Heading,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";

import { Image } from "../Image";

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

interface PageTitleTokenProps extends PageTitleProps {
  backRoute: string;
  tokenImgSrc: string;
}

export const PageTitle = ({ title, subtitle, ...rest }: PageTitleProps & BoxProps) => (
  <Stack spacing={1} position="relative" data-test="page-title">
    <Heading
      fontWeight="semibold"
      size={useBreakpointValue({ base: "xs", sm: "md" })}
      mt={{ base: 6, md: 10, lg: 14 }}
      {...rest}
    >
      {title}
    </Heading>
    {subtitle && (
      <Text color="gray.500" fontSize="xs">
        {subtitle}
      </Text>
    )}
  </Stack>
);

export const PageTitleSection = ({ title }: PageTitleProps) => (
  <Text position="relative" fontSize="xl" fontWeight="semibold" lineHeight="30px">
    {title}
  </Text>
);

export const PageTitleToken = ({
  title,
  backRoute,
  tokenImgSrc,
  ...rest
}: PageTitleTokenProps & BoxProps) => (
  <Box display="flex" alignItems="center" data-test="page-title-token" {...rest}>
    <Link href={backRoute} passHref>
      <IconButton
        minW={9}
        h={9}
        variant="unstyled"
        icon={<ChevronLeftIcon boxSize={6} />}
        aria-label="return"
      />
    </Link>
    <Image src={tokenImgSrc} width={40} height={40} alt="token-logo" />
    <Heading position="relative" ml={4}>
      {title}
    </Heading>
  </Box>
);
