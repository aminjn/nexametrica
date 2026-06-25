// Generic styled element that accepts the prototype's CSS strings plus optional
// hover/focus overrides (the dc-runtime's `style-hover` / `style-focus`).
// Use `as` to render any tag (div by default; button, input, aside, …).
import {
  createElement,
  forwardRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react'
import { css, mergeCss } from '../lib/css'

type BoxProps = {
  as?: keyof JSX.IntrinsicElements
  css?: string | CSSProperties
  hover?: string | CSSProperties
  focus?: string | CSSProperties
  children?: ReactNode
  // passthrough (onClick, placeholder, value, type, href, etc.)
  [key: string]: unknown
}

export const Box = forwardRef(function Box(
  { as = 'div', css: base, hover, focus, children, ...rest }: BoxProps,
  ref: Ref<HTMLElement>,
) {
  const [h, setH] = useState(false)
  const [f, setF] = useState(false)
  const style: CSSProperties = {
    ...css(base),
    ...(h && hover ? css(hover) : null),
    ...(f && focus ? css(focus) : null),
  }
  const handlers: Record<string, unknown> = {}
  if (hover) {
    handlers.onMouseEnter = (e: never) => {
      setH(true)
      ;(rest.onMouseEnter as ((e: never) => void) | undefined)?.(e)
    }
    handlers.onMouseLeave = (e: never) => {
      setH(false)
      ;(rest.onMouseLeave as ((e: never) => void) | undefined)?.(e)
    }
  }
  if (focus) {
    handlers.onFocus = (e: never) => {
      setF(true)
      ;(rest.onFocus as ((e: never) => void) | undefined)?.(e)
    }
    handlers.onBlur = (e: never) => {
      setF(false)
      ;(rest.onBlur as ((e: never) => void) | undefined)?.(e)
    }
  }
  return createElement(as, { ref, ...rest, ...handlers, style }, children)
}) as (props: BoxProps & { ref?: Ref<HTMLElement> }) => JSX.Element

export { mergeCss }
