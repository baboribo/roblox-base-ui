"use client";

import { Skeleton } from "../src/components/ui/skeleton";

export function SkeletonExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Skeleton style={{ height: 120 }} />
      <Skeleton style={{ width: "70%", height: 20 }} />
      <Skeleton style={{ width: "45%" }} />
    </div>
  );
}
