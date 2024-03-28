import axios from 'axios';
import { useEffect, useState } from 'react';

export const Balance = () => {
	const [balance, setBalance] = useState(0);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_BackendUrl}/api/v1/accounts/balance`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('paytmToken')}`,
				},
			})
			.then((res) => {
				setBalance(res.data.data.balance);
			});
	}, [balance]);

	return (
		<div className='flex'>
			<div className='text-lg font-bold'>Your balance</div>
			<div className='ml-4 text-lg font-semibold'>Rs {balance}</div>
		</div>
	);
};
