import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BottomWarning } from '../components/BottomWarning';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { SubHeading } from '../components/SubHeading';

export const Signin = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	async function sendReq() {
		try {
			const { data } = await axios.post('http://localhost:4000/api/v1/users/login', {
				username,
				password,
			});
			console.log(data);
			if (data.statusCode == 200) {
				toast.success(data.message);
				localStorage.setItem('paytmToken', data.data.paytmToken);
				setTimeout(() => {
					navigate('/dashboard');
				}, 2000);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	}
	return (
		<div className='flex justify-center h-screen bg-slate-300'>
			<div className='flex flex-col justify-center'>
				<div className='p-2 px-4 text-center bg-white rounded-lg w-80 h-max'>
					<Heading label={'Sign in'} />
					<SubHeading label={'Enter your credentials to access your account'} />
					<InputBox
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						placeholder='exmaple@gmail.com'
						label={'Email'}
					/>
					<InputBox
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						placeholder='123456'
						label={'Password'}
					/>
					<div className='pt-4'>
						<Toaster />;
						<Button label={'Sign in'} onClick={sendReq} />
					</div>
					<BottomWarning
						label={"Don't have an account?"}
						buttonText={'Sign up'}
						to={'/signup'}
					/>
				</div>
			</div>
		</div>
	);
};
