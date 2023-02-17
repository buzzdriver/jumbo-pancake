import { FC } from "react";

import { Card } from "../Card";

interface SaleCardProps {
  title: string;
  className?: string;
  children?: JSX.Element | React.ReactNode;
}

export const SaleCard: FC<SaleCardProps> = (props) => (
  <Card h={80}>
    <div className="p-10 text-white">
      <p className="font-light">{props.title}</p>
      {props.children}
    </div>
  </Card>
);
