/** 외부 handle로 연결된 Trigger도 같은 설명 ID를 구독합니다. DOM이나 열림 상태는 저장하지 않습니다. */
export function createTooltipDescription() {
  let id: string | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => id,
    getServerSnapshot: () => undefined,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(next: string | undefined) {
      if (id === next) return;
      id = next;
      listeners.forEach((listener) => listener());
    },
  };
}
export type TooltipDescription = ReturnType<typeof createTooltipDescription>;
const handles = new WeakMap<object, TooltipDescription>();
export function descriptionForHandle(handle: object) {
  let description = handles.get(handle);
  if (!description) {
    description = createTooltipDescription();
    handles.set(handle, description);
  }
  return description;
}
