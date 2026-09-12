"use client";
import { useState } from "react";
import { Toggle } from "../src/components/ui/toggle";

export function ToggleControlledExample() {
  const [pressed, setPressed] = useState(false);
  return (
    <div>
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        굵게
      </Toggle>
      <p role="status">{pressed ? "굵게 켜짐" : "굵게 꺼짐"}</p>
    </div>
  );
}
