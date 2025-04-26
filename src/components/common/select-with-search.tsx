import { cn } from "@/lib/utils.ts";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface SelectWithSearchProps {
	options: Array<{ label: string; value: string }>;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function SelectWithSearch({
	options,
	value,
	onChange,
	placeholder,
}: SelectWithSearchProps) {
	const [open, setOpen] = useState(false);

	console.log({
		value,
		find: options.find((framework) => framework.value === value),
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="justify-between"
				>
					{value
						? options.find((option) => option.value === value)?.label
						: (placeholder ?? "")}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command
					filter={(vl, search) => {
						return vl.toLowerCase().normalize("NFC").includes(search) ? 1 : 0;
					}}
				>
					<CommandInput placeholder="Filtrar" />
					<CommandList>
						<CommandEmpty>
							<p className="text-center">Nenhum resultado encontrado</p>
						</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={(currentLabel) => {
										const currentOption = options.find(
											(op) => op.label === currentLabel,
										);

										if (currentOption) {
											onChange(currentOption.value);
										}

										setOpen(false);
									}}
								>
									{option.label}
									<Check
										className={cn(
											"ml-auto",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
