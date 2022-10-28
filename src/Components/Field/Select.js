import { Label, Input } from "reactstrap";

export const Select = ({
	handleChange,
	label,
	render,
	required,
	regex,
	conditions,
	options,
	...props
}) => {
	if (!render) return null;

	return (
		<>
			{props.type !== "checkbox" && <Label htmlFor={props.name}>{label}</Label>}
			<Input
				onChange={handleChange}
				required={!!required || !!regex}
				id={props.name}
				pattern={regex}
				{...props}
			>
				{options?.map(({ value, label }) => (
					<option value={value} key={value}>
						{label}
					</option>
				))}
			</Input>
			<div className="invalid-feedback">
      	
				</div>
		</>
	);
};
