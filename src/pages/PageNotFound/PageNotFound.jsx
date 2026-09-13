import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
	return (
		<section className="mt-5 flex flex-col justify-center items-center text-center ">
			<h1 className="text-6xl font-bold mb-4 text-white">Oops!...</h1>
			<h1 className="text-6xl font-bold mb-4 text-white">404... Page Not Found</h1>
			  
			<p className="text-xl mb-5 text-white">This page does not exist</p>
			<Link
				to="/dashBoard"
				className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
			>
				Go Back
			</Link>
		</section>
	);
};

export default PageNotFound;