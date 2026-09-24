/** Button styles from the approved design system: ≥44px target, 10px radius, colour-only hover. */
type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'md' | 'sm'

const baseClasses =
  'inline-flex min-h-tap items-center justify-center gap-2 rounded-md border text-center font-semibold leading-tight ' +
  'transition-colors duration-150 motion-reduce:transition-none'

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-accent-fill text-on-accent shadow-sm hover:bg-accent-fill-hover hover:shadow-md',
  outline: 'border-line-strong bg-transparent text-ink hover:border-accent hover:text-accent',
  ghost: 'border-transparent bg-transparent text-ink-body hover:text-accent hover:underline underline-offset-4',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[0.9375rem]',
  sm: 'px-3.5 py-2 text-[0.875rem]',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md') {
  return `${baseClasses} ${variants[variant]} ${sizes[size]}`
}
