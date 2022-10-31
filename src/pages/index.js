import Head from "next/head";
import Link from "next/link";
import { URL } from "../utils";

import { Alert, Row, Col, Card, CardTitle, CardText } from "reactstrap";

export default function Index({ data }) {
	return (
		<>
			<Head>
				<title>Digiventures challenge</title>
			</Head>
			<main>
				<h1>Pages generated</h1>
				<Row className="my-2">
					{!!data?.length 
					? data.map((page) => (
						<Col className="my-2" sm="6" key={page.path}>
							<Card body>
								<CardTitle tag="h5">{page.title}</CardTitle>
								<CardText>
									Path: <i>{page.path}</i>
								</CardText>
								<Link href={`/${page.path}`}>
									Go to page
								</Link>
							</Card>
						</Col>
					))
				: <Alert className="my-2" color="danger">
						No pages generated
				</Alert>}
				</Row>
			</main>
		</>
	);
}

export const getServerSideProps = async () => {
	const res = await fetch(`${URL}/configuration`);
	const pages = res.status === 404 ? null : await res.json();

	if (!pages) {
		return {
			notFound: true,
		};
	}

	const data = pages.map((page) => ({
		path: page.path,
		title: page.title,
	}));

	return {
		props: { data },
	};
};
