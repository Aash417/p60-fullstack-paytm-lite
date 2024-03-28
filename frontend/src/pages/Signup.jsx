import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BottomWarning } from '../components/BottomWarning';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { SubHeading } from '../components/SubHeading';

export const Signup = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	async function sendReq() {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BackendUrl}/api/v1/users/signup`,
				{
					username,
					firstName,
					lastName,
					password,
				}
			);
			if (response.status === 201) toast.success('user created successfully.');
			else toast.error('Some error occurred. Try again.');

			setTimeout(() => {
				navigate('/signin');
			}, 2000);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	}
	return (
		<div className='flex justify-center h-screen bg-slate-300'>
			<div className='flex flex-col justify-center'>
				<div className='p-2 px-4 text-center bg-white rounded-lg w-80 h-max'>
					<Heading label={'Sign up'} />
					<SubHeading label={'Enter your infromation to create an account'} />
					<InputBox
						onChange={(e) => {
							setFirstName(e.target.value);
						}}
						placeholder='John'
						label={'First Name'}
					/>
					<InputBox
						onChange={(e) => {
							setLastName(e.target.value);
						}}
						placeholder='Doe'
						label={'Last Name'}
					/>
					<InputBox
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						placeholder='example@gmail.com'
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
						<Toaster />
						<Button onClick={sendReq} label={'Sign up'} />
					</div>
					<BottomWarning
						label={'Already have an account?'}
						buttonText={'Sign in'}
						to={'/signin'}
					/>
				</div>
			</div>
		</div>
	);
};
