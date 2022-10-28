import { Label, Input } from "reactstrap";

export const Text = ({
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
			/>
			{props.type === "checkbox" && <Label htmlFor={props.name}>{label}</Label>}
			<div className="invalid-feedback">
      	
    	</div>
		</>
	);
};
