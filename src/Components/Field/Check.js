import { Label, Input } from "reactstrap";

export const Check = ({
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
			<Input
				onChange={handleChange}
				required={!!required || !!regex}
				id={props.name}
				pattern={regex}
        checked={props.value}
				{...props}
			/>
			<Label htmlFor={props.name}>{label}</Label>
			<div className="invalid-feedback">
      	
    	</div>
		</>
	);
};
