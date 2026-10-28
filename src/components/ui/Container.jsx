export default function Container({ as = 'div', className = '', children, ...rest }) {
  const Tag = as;
  return (
    <Tag className={`mx-auto w-full max-w-[90rem] px-[clamp(1.25rem,4vw,3rem)] ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
