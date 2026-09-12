import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  type ButtonProps,
  type ButtonVariant,
} from "../src/components/ui/button";
import { VariantMatrix } from "./components/variant-matrix";
import { ButtonOverviewExample } from "../examples/button-overview";
import { ButtonLoadingExample } from "../examples/button-loading";
const variants = [
  "emphasis",
  "standard",
  "soft-emphasis",
  "sub-emphasis",
  "subtle",
  "utility",
  "over-media",
  "alert",
  "link",
] as const satisfies readonly ButtonVariant[];
const sizes = ["xs", "sm", "md", "lg"] as const satisfies readonly NonNullable<
  ButtonProps["size"]
>[];
const meta = {
  title: "입력/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "저장", variant: "emphasis", size: "lg", disabled: false },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: { control: "select", options: sizes },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "기본" };
export const Disabled: Story = { name: "비활성", args: { disabled: true } };
export const Variants: Story = {
  name: "종류와 크기",
  render: () => <ButtonOverviewExample />,
};
export const Loading: Story = {
  name: "로딩",
  render: () => <ButtonLoadingExample />,
};
export const Matrix: Story = {
  name: "전체 상태 조합",
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      {[false, true].map((disabled) => (
        <VariantMatrix
          key={String(disabled)}
          caption={`Button · ${disabled ? "비활성" : "기본"}`}
          rows={variants.map((value) => ({ value, label: value }))}
          columns={sizes.map((value) => ({ value, label: value }))}
          render={(variant, size) => (
            <Button variant={variant} size={size} disabled={disabled}>
              저장
            </Button>
          )}
        />
      ))}
    </>
  ),
};
