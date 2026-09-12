"use client";
import { useState, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./card.css";

export type CardProps = ComponentProps<"section"> & {
  /** 카드의 표면입니다. @defaultValue "outlined" */
  variant?: "outlined" | "filled" | "plain";
  /** 본문과 가장자리 사이의 간격입니다. @defaultValue "default" */
  density?: "default" | "compact";
  /** horizontal은 Media와 Content를 좌우로 배치합니다. @defaultValue "vertical" */
  layout?: "vertical" | "horizontal";
  /** 선택 상태를 표면에 표시합니다. 버튼에도 aria-pressed 등을 지정합니다. @defaultValue false */
  selected?: boolean;
};
export function Card({
  variant = "outlined",
  density = "default",
  layout = "vertical",
  selected = false,
  className,
  ...props
}: CardProps) {
  return (
    <section
      {...props}
      data-variant={variant}
      data-density={density}
      data-layout={layout}
      data-selected={selected || undefined}
      className={cx("rbx-card", className)}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"header">) {
  return <header {...props} className={cx("rbx-card-header", className)} />;
}
export type CardTitleProps = ComponentProps<"h3"> & {
  /** 페이지의 제목 계층에 맞게 선택합니다. @defaultValue "h3" */
  as?: "h2" | "h3" | "h4";
};
export function CardTitle({
  as: Tag = "h3",
  className,
  ...props
}: CardTitleProps) {
  return <Tag {...props} className={cx("rbx-card-title", className)} />;
}
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-card-description", className)} />;
}
export function CardMeta({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cx("rbx-card-meta", className)} />;
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-card-content", className)} />;
}
export type CardFooterProps = ComponentProps<"div"> & {
  /** 본문과 작업 영역 사이에 구분선을 표시합니다. @defaultValue false */
  divider?: boolean;
};
export function CardFooter({
  divider = false,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      {...props}
      data-divider={divider || undefined}
      className={cx("rbx-card-footer", className)}
    />
  );
}
export type CardMediaProps = ComponentProps<"div"> & {
  /** 썸네일 비율입니다. 가로 배치에서는 정사각형을 기준으로 늘어납니다. @defaultValue "video" */
  ratio?: "video" | "square" | "wide";
};
export function CardMedia({
  ratio = "video",
  className,
  ...props
}: CardMediaProps) {
  return (
    <div
      {...props}
      data-ratio={ratio}
      className={cx("rbx-card-media", className)}
    />
  );
}
export type CardImageProps = Omit<ComponentProps<"img">, "alt"> & {
  /** 제목과 중복되는 장식 이미지에는 빈 문자열을 지정합니다. */
  alt: string;
  /** 이미지가 없거나 로딩에 실패했을 때 표시할 내용입니다. */
  fallback?: ReactNode;
  /** cover는 채우기, contain은 이미지 전체 표시입니다. @defaultValue "cover" */
  fit?: "cover" | "contain";
};
export function CardImage({
  src,
  srcSet,
  alt,
  fallback = "미리보기 없음",
  fit = "cover",
  className,
  onError,
  ...props
}: CardImageProps) {
  const [failed, setFailed] = useState<string>();
  // src 또는 srcSet이 바뀌면 이전 실패 결과를 재사용하지 않습니다.
  const identity = JSON.stringify([src, srcSet]);
  if ((!src && !srcSet) || failed === identity) {
    return (
      <div
        className={cx("rbx-card-image-fallback", className)}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {fallback}
      </div>
    );
  }
  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      src={src}
      srcSet={srcSet}
      alt={alt}
      data-fit={fit}
      className={cx("rbx-card-image", className)}
      onError={(event) => {
        setFailed(identity);
        onError?.(event);
      }}
    />
  );
}
export type CardLinkProps = ComponentProps<"a"> & {
  /** 제목 링크의 클릭 영역을 카드 전체로 넓힙니다. @defaultValue true */
  stretch?: boolean;
};
// Card 전체를 링크로 감싸지 않아 Footer에 별도 버튼을 둘 수 있습니다.
export function CardLink({
  stretch = true,
  className,
  ...props
}: CardLinkProps) {
  return (
    <a
      {...props}
      data-stretch={stretch || undefined}
      className={cx("rbx-card-link", className)}
    />
  );
}

export type CardActionProps = ComponentProps<"button"> & {
  /** 제목 버튼의 클릭 영역을 카드 전체로 넓힙니다. @defaultValue true */
  stretch?: boolean;
};
export function CardAction({
  stretch = true,
  type = "button",
  className,
  ...props
}: CardActionProps) {
  return (
    <button
      {...props}
      type={type}
      data-stretch={stretch || undefined}
      className={cx("rbx-card-action", className)}
    />
  );
}
