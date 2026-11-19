import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Hexagonal Shield Foundation */}
            <path
                d="M24 4L42 12V26C42 36.5 34.3 43.1 24 46C13.7 43.1 6 36.5 6 26V12L24 4Z"
                fill="currentColor"
                fillOpacity="0.12"
            />
            {/* Stylized Interlocking H & R + Human Network Node */}
            {/* Left pillar of H */}
            <rect
                x="14"
                y="15"
                width="4.5"
                height="18"
                rx="2.25"
                fill="currentColor"
            />
            {/* Center crossbar */}
            <rect
                x="14"
                y="21.75"
                width="14"
                height="4.5"
                rx="2"
                fill="currentColor"
            />
            {/* Right loop & stem forming R */}
            <path
                d="M23.5 15H30.5C33.5376 15 36 17.4624 36 20.5C36 23.5376 33.5376 26 30.5 26H23.5V15Z"
                fill="currentColor"
            />
            {/* R leg */}
            <path
                d="M28 25L35.5 33"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            {/* Inner human presence / accent star dot */}
            <circle cx="24" cy="11.5" r="3" className="fill-amber-400" />
        </svg>
    );
}
