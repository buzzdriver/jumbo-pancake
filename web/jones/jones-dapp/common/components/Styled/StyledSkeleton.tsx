import {
  Skeleton,
  SkeletonCircle,
  SkeletonProps,
  SkeletonText,
  SkeletonTextProps,
} from "@chakra-ui/react";

const skeletonColors = {
  startColor: "gray.500",
  endColor: "gray.700",
};

const StyledSkeleton = (props: SkeletonProps) => <Skeleton {...skeletonColors} {...props} />;
const StyledSkeletonCircle = (props: SkeletonProps) => (
  <SkeletonCircle {...skeletonColors} {...props} />
);
const StyledSkeletonText = (props: SkeletonTextProps) => (
  <SkeletonText {...skeletonColors} {...props} />
);

export { StyledSkeleton, StyledSkeletonCircle, StyledSkeletonText };
