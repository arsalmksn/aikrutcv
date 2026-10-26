import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className = 'size-full object-contain',
    alt = 'Aikrut Logo',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/aikrut-logo.png"
            alt={alt}
            className={className}
            {...props}
        />
    );
}

