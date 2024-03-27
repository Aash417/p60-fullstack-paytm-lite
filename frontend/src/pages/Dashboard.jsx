import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Appbar } from './../components/Appbar';
import { Balance } from './../components/Balance';
import { Users } from './../components/Users';

export const Dashboard = () => {
	const navigate = useNavigate();
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		try {
			const token = localStorage.getItem('paytmToken');
			if (!token) {
				navigate('/signin');
				return;
			}
			axios
				.get('http://localhost:4000/api/v1/users/currentUser', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setAllowed(true);
					console.log(res.data.user);
				})
				.catch((e) => {
					console.log(e.response);
					toast.error('login again to get access.');

					setTimeout(() => {
						navigate('/signin');
					}, 3000);
				});
		} catch (error) {
			console.log(error);
		}
	}, [navigate]);

	return (
		<div className=''>
			{allowed && (
				<>
					<Appbar />
					<div className='m-8'>
						<Balance />
						<Users />
					</div>
				</>
			)}
		</div>
	);
};
