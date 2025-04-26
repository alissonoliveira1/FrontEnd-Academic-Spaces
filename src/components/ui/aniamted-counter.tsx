import { useEffect, useState } from "react";

export interface AnimatedCounterProps {
	value: number;
	duration?: number;
}

export function AnimatedCounter({
	value,
	duration = 100,
}: AnimatedCounterProps) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!value) return;

		let start = 0;
		const end = value;
		const incrementTime = (duration / end) * 0.7;

		const timer = setInterval(() => {
			start += 1;
			setCount(start);
			if (start === end) {
				clearInterval(timer);
			}
		}, incrementTime);

		return () => clearInterval(timer);
	}, [value, duration]);

	return count;
}
