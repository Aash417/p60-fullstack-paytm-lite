import axios from 'axios';
import { useEffect } from 'react';

export const Balance = ({ value }) => {
	useEffect(() => {
		axios.get('http://localhost:4000/api/v1/accounts/balance').then((res) => console.log(res));
	}, []);

	return (
		<div className='flex'>
			<div className='text-lg font-bold'>Your balance</div>
			<div className='ml-4 text-lg font-semibold'>Rs {value}</div>
		</div>
	);
};
