import { Input } from "../src/components/ui/input";
export function InputAdornmentStatesExample() {
  return (
    <label>
      수량
      <Input
        leading={0}
        aria-invalid="true"
        aria-describedby="quantity-error"
      />
      <span id="quantity-error">수량을 입력하세요.</span>
    </label>
  );
}
