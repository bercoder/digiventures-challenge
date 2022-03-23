import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import {
	FormGroup,
	Form,
	Button,
	Spinner,
	UncontrolledAlert,
} from "reactstrap";

import { Input } from "../Components/Input";
import { Post } from "../services";
import { validInputTypes, URL } from "../utils";

export default function Page({ title, inputs, path, _id }) {
	const [state, setState] = useState([]);
	const [saving, setSaving] = useState(false);
	const [alert, setAlert] = useState({
		color: null,
		msg: null,
	});

	const [observeChanges, setObserveChanges] = useState({
		validation: [],
		render: [],
	});

	useEffect(() => {
		if (!inputs) return;

		inputs.forEach((el) => {
			if (el.conditions?.render) {
				const item = el.conditions.render.flat()[0];

				const obj = {
					name: el.name,
					observe: item.input,
					conditions: item,
				};

				setObserveChanges((prev) => ({
					validation: [...prev.validation],
					render: [...prev.render, obj],
				}));
			}

			if (el.conditions?.validations) {
				const item = el.conditions.validations.flat();

				const items = item.map((element) => ({
					name: el.name,
					observe: el.name,
					conditions: element,
				}));

				setObserveChanges((prev) => ({
					validation: [...prev.validation, ...items],
					render: [...prev.render],
				}));
			}
		});
	}, [path]);

	useEffect(() => {
		setState(
			inputs.map((item) => {
				const { conditions, ...data } = item;
				const render = shouldRender(item.name);

				return {
					name: data.name || data.label || data.target,
					render,
					value: "",
					...data,
				};
			})
		);
	}, [observeChanges.render, path]);

	function compareTo({ comparision, input, values }, origin = null) {
		const element = document.getElementById(input);

		if (comparision === "includes") {
			if (!!values?.length) {
				return values.some((el) => el.includes(element?.value));
			}
		}

		if (comparision === "not_includes") {
			if (!!values?.length) {
				// origin es desde cual elemento llamo a la función
				if (element.nodeName === "SELECT" && !!origin) {
					return !Object.values(element.childNodes).some(
						(el) => el.value.toLowerCase() === origin.value.toLowerCase()
					);
				}
				return !values.some((el) => el.includes(element?.value));
			}
		}

		if (comparision === "same") {
			return element?.value === origin?.value;
		}

		return false;
	}

	function shouldRender(input) {
		let valids = [];

		observeChanges.render.forEach((el) => {
			if (el.name === input) {
				valids.push(compareTo(el.conditions));
			}
		});

		if (!valids.length) return true;

		return valids.every((el) => el);
	}

	function checkValidation(target) {
		const isObserved = observeChanges.validation.some(
			(el) => el.observe === target.name
		);

		if (!isObserved) {
			return;
		}

		let valids = [];
		observeChanges.validation.forEach((el) => {
			if (el.name === target.name) {
				valids.push(compareTo(el.conditions, target));
			}
		});

		if (valids.every((el) => !el)) {
			target.setCustomValidity("Error");
			target.classList.add("is-invalid");
		} else {
			target.setCustomValidity("");
			target.classList.remove("is-invalid");
		}
	}

	function handleChange(e) {
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;

		updateState(e.target.name, value);
		checkValidation(e.target);
	}

	function updateState(input, value) {
		const isObserved = observeChanges.render.some((el) => el.observe === input);

		setState((prevState) =>
			prevState.map((item) => ({
				...item,
				render: isObserved ? shouldRender(item.name) : item.render,
				value: input === item.name ? value : item.value,
			}))
		);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!e.target.checkValidity()) {
			e.stopPropagation();
			return;
		}

		e.target.classList.add("was-validated");

		const data = state.reduce((prev, cur) => {
			return validInputTypes.includes(cur.type)
				? { ...prev, [cur.name]: cur.value }
				: { ...prev };
		}, {});

		setSaving(true);
		Post(path, data)
			.then(() => {
				setAlert({
					color: "success",
					msg: "Form submitted",
				});
				setState((prevState) =>
					prevState.map((item) => ({
						...item,
						value: "",
					}))
				);
				e.target.classList.remove("was-validated");
				e.target.querySelector("input").focus();
			})
			.catch(() => {
				setAlert({
					color: "danger",
					msg: "Error while submitting",
				});
			})
			.finally(() => {
				setSaving(false);
				setTimeout(
					() =>
						setAlert({
							color: null,
							msg: null,
						}),
					2500
				);
			});
	}

	return (
		<>
			<Head>
				<title>{`${title} :: Digiventures challenge`}</title>
			</Head>

			<main>
				<h1 className="text-center">{title}</h1>
				<Form onSubmit={handleSubmit}>
					{state.map((item) => (
						<FormGroup key={item.name}>
							{validInputTypes.includes(item.type) && (
								<Input handleChange={handleChange} {...item} />
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
				</Form>
			</main>
		</>
	);
}

export const getStaticPaths = async () => {
	const res = await fetch(`${URL}/configuration`);
	const pages = await res.json();

	return {
		paths: Object.values(pages).map((page) => ({
			params: { path: page.path },
		})),
		fallback: false,
	};
};

export const getStaticProps = async ({ params: { path } }) => {
	const res = await fetch(`${URL}/configuration/${path}`);
	const page = await res.json();

	return {
		props: page[0],
	};
};
