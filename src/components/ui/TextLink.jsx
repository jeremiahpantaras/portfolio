import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { prefetchProps } from '../../routes';

// Underline-on-hover text link. Pass `to` for client-side routes, `href` for external URLs / mailto.
export default function TextLink({ to, href, children, className = '', arrow = true, ...rest }) {
  const cls = `link-u inline-flex items-center gap-1.5 text-fg-muted transition-colors duration-200 hover:text-fg focus-visible:text-fg ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...prefetchProps(to)} {...rest}>
        {children}
        {arrow && <ArrowRight size={16} aria-hidden="true" />}
      </Link>
    );
  }
  const external = /^https?:/.test(href ?? '');
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {arrow && external && <ArrowUpRight size={16} aria-hidden="true" />}
    </a>
  );
}
