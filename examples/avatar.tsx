"use client";
import { Avatar } from "../src/components/ui/avatar";
export function AvatarExample() {
  return (
    <Avatar.Root>
      <Avatar.Image
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23dbe3ef'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23324c71'/%3E%3Cpath d='M10 64V52a22 22 0 0 1 44 0v12' fill='%23324c71'/%3E%3C/svg%3E"
        alt="사용자 프로필"
      />
      <Avatar.Fallback>김</Avatar.Fallback>
    </Avatar.Root>
  );
}
