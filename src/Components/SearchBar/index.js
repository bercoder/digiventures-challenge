import Link from "next/link";
import { useState, useEffect } from "react";

import { Input, Fade } from "reactstrap";
import { URL } from '../../utils';

export const SearchBar = () => {
	const [inputSearch, setInputSearch] = useState("");
  const [result, setResult] = useState({});

	useEffect(() => {
		const out = document.querySelector('body');

		function handleClickOutside(e) {
			setResult({})
		}

		out.addEventListener('click', handleClickOutside, false);
		
		return () => out.removeEventListener('click', () => handleClick, false);
	}, [])

	useEffect(() => {
		if (!inputSearch) {
      setResult({});
      return;
    };

		const timer = setTimeout(() => search(inputSearch), 600);

		return () => clearTimeout(timer);
	}, [inputSearch]);

	function handleClick(e) {
		if (e.target.classList.contains('result')) {
			setResult({});
			setInputSearch('')
		} else e.stopPropagation()
	}

	async function search(value) {
    const result = await fetch(`${URL}/configuration?search=${value}`);
    const data = await result.json();

		setResult({
      data
    })
	}


	return (
		<div onClick={handleClick} className="position-relative" >
			<Input
				value={inputSearch}
				onChange={({ target: { value } }) => setInputSearch(value)}
				type="search"
        placeholder="Search pages"
			/>
      {!!result.data && <Fade className="position-absolute shadow border p-3 bg-white w-100 mt-1 rounded-bottom">
        {result.data?.map(({ path }) => <Link key={path} href={`/${path}`}>
			    <a style={{ fontSize: '.9em'}} className={`result d-block text-capitalize`}>{path}</a>
		    </Link>)}
        {!result.data?.length && <small className="fst-italic">No results</small>}
      </Fade>}
		</div>
	);
};
