import React, { useState, useEffect } from 'react';
import { rot18 } from '@/utils/rot18';

interface DeobfuscatorProps {
  text: string;
  className?: string;
  type?: 'email' | 'phone' | 'link' | 'text';
  hrefPrefix?: string;
}

export const Deobfuscator: React.FC<DeobfuscatorProps> = ({ 
  text, 
  className, 
  type = 'text',
  hrefPrefix = '' 
}) => {
  const [decoded, setDecoded] = useState(text);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setDecoded(rot18(text));
    setIsReady(true);
  }, [text]);

  if (!isReady) {
    return <span className={className}>{text}</span>;
  }

  if (type === 'email') {
    return (
      <a 
        href={`mailto:${decoded}`} 
        className={className}
        rel="nofollow, noindex"
      >
        {decoded}
      </a>
    );
  }

  if (type === 'phone') {
    return (
      <a 
        href={`tel:${decoded.replace(/[^0-9]/g, '')}`} 
        className={className}
        rel="nofollow, noindex"
      >
        {decoded}
      </a>
    );
  }

  if (type === 'link') {
    return (
      <a 
        href={`${hrefPrefix}${decoded}`} 
        className={className}
        rel="nofollow, noindex"
      >
        {decoded}
      </a>
    );
  }

  return <span className={className}>{decoded}</span>;
};
