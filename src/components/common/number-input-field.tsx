import { Input } from "@/components/ui/input.tsx";
import * as numberInput from "@zag-js/number-input";
import { normalizeProps, useMachine } from "@zag-js/react";

export interface NumberInputFieldProps {
	onChange: (value: number) => void;
	value: number;
}

export function NumberInputField({ onChange, value }: NumberInputFieldProps) {
	const service = useMachine(numberInput.machine, {
		min: 1,
		id: NumberInputField.name,
		defaultValue: String(value),
		inputMode: "numeric",
		onValueChange(details) {
			if (Number.isNaN(details.valueAsNumber)) {
				return;
			}

			onChange(details.valueAsNumber);
		},
		value: String(value),
		formatOptions: {
			maximumFractionDigits: 0,
		},
	});

	const api = numberInput.connect(service, normalizeProps);

	return <Input {...api.getInputProps()} />;
}
