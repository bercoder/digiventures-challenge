import { Label, Input as BInput } from "reactstrap";

export const Input = ({
	handleChange,
	label,
	render,
	required,
	regex,
	conditions,
	...props
}) => {
	if (!render) return null;

	const requiere = required !== undefined ? required : !!regex;

	return (
		<>
			{props.type !== "checkbox" && <Label htmlFor={props.name}>{label}</Label>}
			<BInput
				onChange={handleChange}
				required={requiere}
				id={props.name}
				pattern={regex}
				{...props}
			>
				{props.options?.map(({ value, label }) => (
					<option value={value} key={value}>
						{label}
					</option>
				))}
			</BInput>
			{props.type === "checkbox" && <Label htmlFor={props.name}>{label}</Label>}
		</>
	);
};
