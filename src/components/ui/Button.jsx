import { Link } from 'react-router-dom';
import { prefetchProps } from '../../routes';

const base =
  'group inline-flex min-h-9 pointer-coarse:min-h-11 items-center justify-center gap-2 px-4 py-2 text-small font-medium transition-[background-color,border-color,box-shadow,filter] duration-200 active:translate-y-px';
const variants = {
  // Orange gradient button with square corners and a soft glow (dark text is >= 6:1 on both stops).
  primary:
    'bg-[linear-gradient(180deg,#ffa24f_0%,#f2761f_100%)] text-[#1a0b04] shadow-[0_8px_28px_-8px_rgb(255_122_40/0.65),inset_0_1px_0_rgb(255_255_255/0.35)] hover:brightness-110 focus-visible:brightness-110',
  // No background or border: text with an underline that draws in on hover (like the nav links).
  ghost: 'link-u px-1 text-fg',
  secondary: 'border border-line-strong bg-ink-850/60 text-fg hover:border-fg focus-visible:border-fg',
};

// Renders a router <Link> (`to`), an external/mailto <a> (`href`) or a <button>.
export default function Button({ to, href, variant = 'secondary', className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...prefetchProps(to)} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
