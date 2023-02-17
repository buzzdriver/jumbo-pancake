import { FC } from "react";
import { Badge } from ".";
import { renderPercentage } from "../../utils/numbers";

interface PnlBadgeProps {
  value: number | undefined;
}
export const PnlBadge: FC<PnlBadgeProps> = ({ value }) => {
  const getPnlBadgeProps = (): {
    textColor: "green" | "red" | "default" | "gray";
    prefix: "+" | "";
  } => {
    if (value === undefined) return { textColor: "gray", prefix: "" };
    switch (Math.sign(value)) {
      case 1:
        return { textColor: "green", prefix: "+" };
      case -1:
        return { textColor: "red", prefix: "" };
      default:
        return { textColor: "default", prefix: "" };
    }
  };

  const { textColor, prefix } = getPnlBadgeProps();

  return <Badge title={`${prefix}${renderPercentage(value, 2, "-%")}`} textColor={textColor} />;
};
