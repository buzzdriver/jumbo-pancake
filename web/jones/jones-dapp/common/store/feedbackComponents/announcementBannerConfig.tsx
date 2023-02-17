import { ReactElement } from "react";

import { Button, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

import { ArrowUpRightIcon } from "../../icons";

export interface Announcement {
  startDate: Date;
  endDate: Date;
  title: string;
  action: ReactElement;
  secondaryAction?: ReactElement;
}

export const announcements: Announcement[] = [
  {
    startDate: new Date("04/01/22"),
    endDate: new Date("07/14/22"),
    title:
      "Staking contracts are migrated. Please unstake and restake your assets starting May 6th 12:30 UTC.",
    action: (
      <NextLink href="https://jonesdao.ghost.io/upgrading-our-farms/" passHref>
        <Link fontSize="xs" fontWeight="medium" textDecor="underline" isExternal minW="fit-content">
          Learn
          <span className="ml-1">
            <ArrowUpRightIcon fill="white" width="10px" height="10px" />
          </span>
        </Link>
      </NextLink>
    ),
    secondaryAction:
      // May 6 12:30 UTC
      new Date().getTime() < 1651840200000 ? (
        <></>
      ) : (
        <NextLink href="/staking" passHref>
          <Link fontSize="xs" fontWeight="medium" _hover={{ textDecoration: "none" }}>
            <Button variant="secondary-banner" size="sm" ml={{ base: 2, md: 0 }}>
              <Text>Migrate now</Text>
            </Button>
          </Link>
        </NextLink>
      ),
  },
];
