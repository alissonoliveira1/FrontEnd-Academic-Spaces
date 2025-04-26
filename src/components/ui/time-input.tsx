import { Input } from "@/components/ui/input.tsx";
import { Clock } from "lucide-react";
import {
	type InputHTMLAttributes,
	type Ref,
	type RefObject,
	useRef,
} from "react";

interface InputWithShowPicker extends HTMLInputElement {
	showPicker: () => void;
}

type TimeInputProps = Omit<InputHTMLAttributes<InputWithShowPicker>, "type"> & {
	ref?: Ref<InputWithShowPicker>;
	showPicker?: () => void;
};

export function TimeInput(props?: TimeInputProps) {
	const inputRef = useRef(null) as unknown as RefObject<InputWithShowPicker>;

	function handleOpenPicker() {
		if (inputRef.current) {
			inputRef.current.showPicker();
		}
	}

	return (
		<div className="relative">
			<Input
				{...props}
				ref={inputRef}
				type="time"
				className="appearance-none placeholder:text-muted-foreground hide-native"
				lang="en-GB"
			/>
			<Clock
				onClick={handleOpenPicker}
				className="absolute right-2 top-2.5 size-4 opacity-50 cursor-pointer "
			/>
		</div>
	);
}
