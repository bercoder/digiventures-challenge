import Link from "next/link";
import { useRouter } from 'next/router'
import { useState } from "react";
import {
	Navbar,
	Nav,
	NavbarToggler,
	Collapse,
	NavItem
} from "reactstrap";

import { SearchBar } from '../SearchBar';

export const Menu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { query } = useRouter();
	
	const menuItems = [{ path: 'login'}, {path: 'register' }];

	return (
		<Navbar color="light" expand="md" light>
			<Link href={`/`}>
				<a className="navbar-brand">Digiventures challenge</a>
			</Link>
			<NavbarToggler onClick={() => setIsOpen((prev) => !prev)} />
			<Collapse isOpen={isOpen} navbar>
				<Nav className="justify-content-start ms-2 w-100" navbar>
					{menuItems?.map(({path}) => <Item key={path} path={path} active={query?.path} />)}
				</Nav>
				<SearchBar />
			</Collapse>
		</Navbar>
	);
};

export const Item = ({ path, active = null }) => (
	<NavItem>
		<Link href={`/${path}`}>
			<a className={`text-capitalize nav-link ${active === path ? 'active' : ''}`}>{path}</a>
		</Link>
	</NavItem>
);
