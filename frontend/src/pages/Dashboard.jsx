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
  const [user, setUser] = useState();

  useEffect(() => {
		try {
			const token = localStorage.getItem('paytmToken');
			if (!token) {
				navigate('/signin');
				return;
			}
			axios
				.get(`${import.meta.env.VITE_BackendUrl}/api/v1/users/currentUser`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setAllowed(true);
					setUser(res.data.user);
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
					<Appbar firstName={user.firstName} />
					<div className='mx-auto lg:w-1/2'>
						<div className='p-4 '>
							<Balance />
							<Users />
						</div>
					</div>
				</>
			)}
		</div>
  );
};
