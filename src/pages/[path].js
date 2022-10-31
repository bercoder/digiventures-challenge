import { useState, useEffect } from "react";
import Head from "next/head";

import { Form } from '../Components/Form';

import { Post } from "../services";
import { validInputTypes, URL } from "../utils";

export default function Page({ title, inputs, path }) {
	const [state, setState] = useState([]);
	const [initialState, setInitialState] = useState([]);
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

		let render = []
		let validation = []

		inputs.forEach((el) => {
			if (!!el.conditions?.render.length) {
				const item = el.conditions.render.flat()[0];

				const name = el.name || el.label || el.target;

				const obj = {
					name,
					observe: item.input,
					conditions: item,
				};

				render.push(obj)
			}

			if (el.conditions?.validations) {
				const item = el.conditions.validations.flat();

				const items = item.map((element) => ({
					name: el.name,
					observe: el.name,
					conditions: element,
				}));

				if (!!items.length) validation = [...validation, ...items]

			}
			setObserveChanges({
				validation,
				render
			})
		});
	}, [path]);

	useEffect(() => {
		const inputsData = inputs.map((item) => {
			const { conditions, ...data } = item;

			const render = typeof item.name === "undefined" ? true : shouldRender(item.name);
			
			const name = data.name || data.label || data.target;
			
			const value = data.value || data.type === 'select' ? item.options[0]?.value : ''

			return {
				name,
				render,
				value,
				...data,
			};
		});

		setState(inputsData);
		setInitialState(inputsData);
	}, [observeChanges.render, path])

	function compareTo({ comparision, input, values }, origin = null) {
		const element = document.getElementById(input);

		if (comparision === "includes") {
			if (!!values?.length) {
				const value = values.some((el) => {

					if (el === "true" ) {
						return Boolean(element?.checked) === true;
					}

					if (el === "false") {
						return Boolean(element?.checked) === false;
					}
					
					return el.includes(element?.value)
				});
				return {
					value,
					error: `Includes not alowed values (${values.join(", ")})`,
				};
			}
		}

		if (comparision === "not_includes") {
			if (!!values?.length) {
				// origin es desde cual elemento llamo a la función
				if (element.nodeName === "SELECT" && !!origin) {
					return {
						value: !Object.values(element.childNodes).some(
							(el) => el.value.toLowerCase() === origin.value.toLowerCase()
						),
						error: `Should not includes ${values.join(", ")}`,
					};
				}
				return {
					value: !values.some((el) => el.includes(element?.value)),
					error: `Should not includes ${values.join(", ")}`,
				};
			}
		}

		if (comparision === "same") {
			const value = element?.value === origin?.value;
			const error = `Value should be equal to ${element.name}`;
			return { value, error };
		}

		return { value: false, error: "" };
	}

	function shouldRender(input) {
		if (!input) return;

		let valids = [];

		observeChanges.render.forEach((el) => {
			if (el.name === input) {
				valids.push(compareTo(el.conditions));
			}
		});

		if (!valids.length) return true;

		return valids.every((el) => el.value);
	}

	function checkValidation(target) {
		const isObserved = observeChanges.validation.some(
			(el) => el.observe === target.name
		);

		let valids = [];

		const regex = new RegExp(target.attributes.pattern?.value);

		if (!regex.test(target.value)) {
			showErrorMessage(target.validationMessage || "Error", target);
		} else {
			hideErrorMessage(target);
		}

		if (!isObserved) {
			return;
		}

		if (isObserved) {
			observeChanges.validation.forEach((el) => {
				if (el.name === target.name) {
					valids.push(compareTo(el.conditions, target));
				}
			});
		}

		let errors = [];

		if (
			valids.every((el) => {
				errors.push(el.error);
				return !el.value;
			})
		) {
			let msg = "Error";
			if (!!errors?.length) {
				msg = [...new Set(errors)].join(" - ");
			}

			showErrorMessage(msg, target);
		} else {
			hideErrorMessage(target);
		}
	}

	function showErrorMessage(msg, target) {
		const div = target.parentNode.querySelector(".invalid-feedback");
		if (!!div && msg) {
			div.innerHTML = msg;
		}
		target.setCustomValidity(msg);
		target.reportValidity();
		target.classList.add("is-invalid");
	}

	function hideErrorMessage(target) {
		const div = target.parentNode.querySelector(".invalid-feedback");
		if (!!div) {
			div.innerHTML = "";
		}
		target.setCustomValidity("");
		target.classList.remove("is-invalid");
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

		const valids = [...validInputTypes, "select", "checkbox"];
		const data = state.reduce((prev, cur) => {
			
			return valids.includes(cur.type)
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
				setState(initialState);
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
					1500
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
				<Form handleChange={handleChange} handleSubmit={handleSubmit} state={state} alert={alert} saving={saving} />
			</main>
		</>
	);
}

export const getServerSideProps = async ({ params: { path } }) => {

	const res = await fetch(`${URL}/configuration/${path}`);
	const page = res.status === 404 ? null : await res.json();

	if (!page) {
		return {
			notFound: true,
		}
	}

	return {
		props: page,
	};

};
