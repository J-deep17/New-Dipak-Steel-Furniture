import React from 'react';
import { cn } from "@/lib/utils";

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    containerClassName?: string;
    showWatermark?: boolean;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({
    className,
    containerClassName,
    alt,
    showWatermark = true,
    ...props
}) => {
    return (
        <div className={cn("relative select-none overflow-hidden", containerClassName)}>
            <img
                {...props}
                alt={alt}
                className={cn("pointer-events-auto select-none", className)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                }}
                draggable={false}
                style={{
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    // @ts-ignore
                    WebkitUserDrag: 'none',
                    // @ts-ignore
                    '-webkit-user-drag': 'none'
                } as any}
            />

            {/* Transparent Overlay to block direct image interaction (long-press/drag) while allowing clicks */}
            <div
                className="absolute inset-0 z-20 bg-transparent"
                onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                }}
            />

            {/* Watermark Overlay */}
            {showWatermark && (
                <div
                    className="absolute inset-0 pointer-events-none z-30 p-4"
                    aria-hidden="true"
                >
                    {/* Top Left */}
                    <div
                        className="absolute top-4 left-4 text-black/30 font-medium select-none"
                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                    >
                        Dipak Furniture
                    </div>

                    {/* Bottom Right */}
                    <div
                        className="absolute bottom-4 right-4 text-black/30 font-medium select-none"
                        style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                    >
                        dipaksteelfurniture.com
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProtectedImage;
