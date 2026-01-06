'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

const CustomLink = forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>(
  (props, ref) => {
    return <Link ref={ref} {...props} />;
  }
);

CustomLink.displayName = 'Link';

export { CustomLink as Link };
