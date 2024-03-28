/* eslint-disable react/prop-types */

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const Appbar = ({ firstName }) => {
	const navigate = useNavigate();

	async function handleLogout() {
		localStorage.removeItem('paytmToken');
		toast.success('Logout successfully.');
		setTimeout(() => {
			navigate('/signin');
		}, 2000);
	}
	return (
		<div className='flex justify-between shadow bg-orange-50 h-14'>
			<div className='flex flex-col justify-center h-full ml-4 font-bold '>
				PayTM Lite App
			</div>
			<div className='flex'>
				<div className='flex flex-col justify-center h-full mr-4'>
					<button
						onClick={handleLogout}
						type='button'
						className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
					>
						Logout
					</button>
				</div>
				<div className='flex justify-center w-12 h-12 mt-1 mr-2 rounded-full bg-slate-200'>
					<div className='flex flex-col justify-center h-full text-xl'>{firstName}</div>
				</div>
			</div>
		</div>
	);
};
