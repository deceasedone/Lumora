"use client" 

import * as React from "react"
import { useState, useRef, forwardRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    onSuccess?: () => void;
    successDuration?: number;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function SuccessParticles({
    buttonRef,
}: {
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect || !buttonRef.current) return null;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
        <AnimatePresence>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed w-1 h-1 bg-black dark:bg-white rounded-full"
                    style={{ left: centerX, top: centerY }}
                    initial={{
                        scale: 0,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
                        y: [0, -Math.random() * 50 - 20],
                    }}
                    transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: "easeOut",
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

const ParticleButton = forwardRef<HTMLButtonElement, ParticleButtonProps>(({
    children,
    onClick,
    onSuccess,
    successDuration = 1000,
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}, ref) => {
    const [showParticles, setShowParticles] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowParticles(true);
        onClick?.(e);
        onSuccess?.();

        setTimeout(() => {
            setShowParticles(false);
        }, successDuration);
    };

    return (
        <div className="relative">
            {showParticles && <SuccessParticles buttonRef={buttonRef} />}
            <Button
                ref={(node) => {
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                    if (buttonRef) {
                        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
                    }
                }}
                onClick={handleClick}
                className={cn(
                    buttonVariants({ variant, size }),
                    "group transition-all duration-200 hover:scale-105 relative",
                    showParticles && "scale-95",
                    className
                )}
                variant={variant}
                size={size}
                asChild={asChild}
                {...props}
            >
                <>
                    {children}
                    <MousePointerClick className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
            </Button>
        </div>
    );
});

ParticleButton.displayName = 'ParticleButton';

export { ParticleButton };
