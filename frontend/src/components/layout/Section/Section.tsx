import type { HTMLAttributes } from "react";

import Container from "../Container";

interface SectionProps
  extends HTMLAttributes<HTMLElement> {

  container?: boolean;

}

export default function Section({

  children,

  className,

  container = true,

  ...props

}: SectionProps) {

  const content = container
    ? <Container>{children}</Container>
    : children;

  return (

    <section
      className={`
        py-24
        ${className ?? ""}
      `}
      {...props}
    >

      {content}

    </section>

  );

}