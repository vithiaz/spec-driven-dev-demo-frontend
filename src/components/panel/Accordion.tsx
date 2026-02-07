'use client';

import {
  Accordion as PrimeAccordion,
  AccordionProps as PrimeAccordionProps,
  AccordionTab as PrimeAccordionTab,
  AccordionTabProps as PrimeAccordionTabProps,
} from 'primereact/accordion';

export interface AccordionTabProps extends PrimeAccordionTabProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export interface AccordionProps extends Omit<PrimeAccordionProps, 'children'> {
  tabs: AccordionTabProps[];
  containerClassName?: string;
}

export function Accordion({
  tabs,
  containerClassName = '',
  ...accordionProps
}: AccordionProps) {
  return (
    <div className={containerClassName}>
      <PrimeAccordion {...accordionProps}>
        {tabs.map((tab, index) => {
          const { header, children, ...tabProps } = tab;
          return (
            <PrimeAccordionTab key={index} header={header} {...tabProps}>
              {children}
            </PrimeAccordionTab>
          );
        })}
      </PrimeAccordion>
    </div>
  );
}
