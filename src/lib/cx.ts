/** Base UI는 className에 문자열 또는 상태 함수를 받습니다. 둘 다 보존합니다. */
export function withClassName<State>(
  base: string,
  custom?: string | ((state: State) => string | undefined),
) {
  return (state: State) =>
    [base, typeof custom === "function" ? custom(state) : custom]
      .filter(Boolean)
      .join(" ");
}
export function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
