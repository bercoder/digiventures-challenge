import Link from "next/link";
import {
	FormGroup,
	Form as BForm,
	Button,
	Spinner,
	UncontrolledAlert,
} from "reactstrap";

import { validInputTypes } from "../../utils";

import { Text } from "../Field/Text";
import { Select } from "../Field/Select";

export const Form = ({ handleChange, handleSubmit, state, alert, saving }) => {
  return (
	<BForm onSubmit={handleSubmit}>
		{state.map((item) => (
			<FormGroup key={item.name}>
				{item.type === "select" && (
					<Select handleChange={handleChange} {...item} />
				)}

				{validInputTypes.includes(item.type) && (
					<Text handleChange={handleChange} {...item} />
				)}

				{item.type === "button" && (
					<div className="d-flex justify-space-between align-items-center mb-4">
						<div className="flex-grow-1 pe-5 d-flex align-items-center ">
							{!!alert.color && (
								<UncontrolledAlert
									className="m-0 flex-fill fade"
									color={alert.color}
								>
									{alert.msg}
								</UncontrolledAlert>
							)}
						</div>
						<Button
							disabled={saving}
							className="d-flex align-items-center"
							type="submit"
						>
							{saving && (
								<Spinner className="spinner-border spinner-border-sm me-2" />
							)}
							{`${saving ? "Wait" : item.label}`}
						</Button>
					</div>
				)}

				{item.type === "link" &&
					(item.target[0] === "_" ? (
						<a href={item.to || item.target} target={item.target}>
							{item.text || item.label}
						</a>
					) : (
						<Link href={item.to || item.target}>
							<a>{item.text || item.label}</a>
						</Link>
					))}
			</FormGroup>
		))}
	</BForm>)
};
