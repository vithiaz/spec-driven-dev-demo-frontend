import React, { useMemo } from 'react';
import {
  Paginator,
  PaginatorCurrentPageReportOptions,
  PaginatorPageLinksOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorNextPageLinkOptions,
  PaginatorProps,
  PaginatorRowsPerPageDropdownOptions,
} from 'primereact/paginator';
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

export type PaginationProps = PaginatorProps;

export function Pagination(props: PaginationProps) {
  const { template, totalRecords, rows, first, ...rest } = props;

  // Ensure at least 1 total record so page 1 is always shown, even when data is empty
  const effectiveTotalRecords = Math.max(totalRecords ?? 0, 1);
  const effectiveRows = rows ?? 10;
  // Ensure first is within valid range (0 to totalRecords - 1)
  const effectiveFirst = Math.min(
    Math.max(first ?? 0, 0),
    Math.max(effectiveTotalRecords - 1, 0)
  );

  const defaultTemplate = useMemo(() => {
    if (typeof template !== 'undefined') {
      return template;
    }

    return {
      layout:
        'RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink',
      RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
        const dropdownOptions =
          options.options ??
          [10, 25, 50].map((value) => ({ label: value, value }));

        return (
          <div className="flex items-center gap-1">
            <span>Show data</span>
            <Dropdown
              value={options.value}
              options={dropdownOptions}
              onChange={options.onChange}
              disabled={options.disabled}
              data-testid="pagination-pagesize-dropdown"
            />
            <span>per page</span>
          </div>
        );
      },
      CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
        return (
          <div
            className="flex items-center gap-2 ml-2 mr-auto p-paginator-current"
            data-testid="pagination-info"
          >
            <span>
              Showing {options.first}-{options.last} of {options.totalRecords}{' '}
              entries
            </span>
          </div>
        );
      },
      PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
        return (
          <Button
            outlined
            icon="pi pi-angle-left"
            onClick={options.onClick}
            disabled={options.disabled}
            aria-label="Previous page"
            size="small"
            data-testid="pagination-button-previous"
          >
            <Ripple />
          </Button>
        );
      },
      NextPageLink: (options: PaginatorNextPageLinkOptions) => {
        return (
          <Button
            outlined
            icon="pi pi-angle-right"
            onClick={options.onClick}
            disabled={options.disabled}
            aria-label="Next page"
            size="small"
            data-testid="pagination-button-next"
          >
            <Ripple />
          </Button>
        );
      },
      PageLinks: (options: PaginatorPageLinksOptions) => {
        const isFirstEllipsis =
          options.view.startPage === options.page && options.view.startPage > 0;
        const isLastEllipsis =
          options.view.endPage === options.page &&
          options.page + 1 < options.totalPages;
        const isActive = options.page === options.currentPage;

        const buttonClassName = classNames(options.className);

        return (
          <React.Fragment>
            {isFirstEllipsis && (
              <span className="px-2 text-sm font-medium text-gray-400 select-none">
                ...
              </span>
            )}

            <Button
              outlined
              className={buttonClassName}
              onClick={options.onClick}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${options.page + 1}`}
              size="small"
              data-testid={`pagination-button-page-${options.page + 1}`}
            >
              {options.page + 1}
              <Ripple />
            </Button>

            {isLastEllipsis && (
              <span className="px-2 text-sm font-medium text-gray-400 select-none">
                ...
              </span>
            )}
          </React.Fragment>
        );
      },
    };
  }, [template]);

  return (
    <Paginator
      template={defaultTemplate}
      first={effectiveFirst}
      totalRecords={effectiveTotalRecords}
      rows={effectiveRows}
      {...rest}
    />
  );
}
