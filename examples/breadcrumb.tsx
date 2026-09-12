"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../src/components/ui/breadcrumb";

export function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components" target="_top">
            컴포넌트
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/foundations" target="_top">
            Foundation
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span aria-current="page">현재 페이지</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
