import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { motion } from 'framer-motion';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
}

export default function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    autoFocus = true
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Split value into individual digits
    const digits = value.split('').slice(0, length);
    while (digits.length < length) {
        digits.push('');
    }

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, newValue: string) => {
        // Only accept digits
        const digit = newValue.replace(/\D/g, '').slice(-1);

        const newDigits = [...digits];
        newDigits[index] = digit;
        onChange(newDigits.join(''));

        // Move to next input if digit entered
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                // Move to previous input on backspace if current is empty
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedDigits = pastedData.replace(/\D/g, '').slice(0, length);

        if (pastedDigits) {
            onChange(pastedDigits);
            // Focus last digit or first empty position
            const nextFocusIndex = Math.min(pastedDigits.length, length - 1);
            inputRefs.current[nextFocusIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
                <motion.input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                        w-11 h-14 sm:w-12 sm:h-16
                        text-center text-2xl font-bold
                        rounded-xl
                        bg-muted/50 border-2
                        ${digit ? 'border-sunset-500 bg-sunset-500/10' : 'border-border'}
                        focus:border-sunset-500 focus:ring-2 focus:ring-sunset-500/20
                        outline-none transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                />
            ))}
        </div>
    );
}
