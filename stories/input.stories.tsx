import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, type InputProps } from "../src/components/ui/input";
import { VariantMatrix } from "./components/variant-matrix";
const variants = [
  "standard",
  "contrast",
  "utility",
] as const satisfies readonly NonNullable<InputProps["variant"]>[];
const sizes = ["xs", "sm", "md", "lg"] as const satisfies readonly NonNullable<
  InputProps["controlSize"]
>[];
const meta = {
  title: "입력/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    "aria-label": "프로젝트 이름",
    placeholder: "프로젝트 이름",
    controlSize: "md",
    disabled: false,
  },
  argTypes: {
    controlSize: { control: "select", options: sizes },
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Invalid: Story = {
  name: "오류",
  args: { "aria-invalid": true, defaultValue: "프로젝트 A" },
};
export const Matrix: Story = {
  name: "전체 상태 조합",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      {["기본", "비활성", "오류"].map((state) => (
        <VariantMatrix
          key={state}
          caption={`Input · ${state}`}
          rows={variants.map((value) => ({ value, label: value }))}
          columns={sizes.map((value) => ({ value, label: value }))}
          render={(variant, controlSize) => (
            <Input
              variant={variant}
              controlSize={controlSize}
              disabled={state === "비활성"}
              aria-invalid={state === "오류" || undefined}
              aria-label={`${variant} ${controlSize} ${state}`}
              defaultValue="프로젝트 A"
            />
          )}
        />
      ))}
    </>
  ),
};
