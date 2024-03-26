import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SendMoney } from './pages/SendMoney';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route index element={<Navigate replace to='signup' />} />
					<Route path='/signup' element={<Signup />} />
					<Route path='/signin' element={<Signin />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/send' element={<SendMoney />} />
				</Routes>
				<Toaster />
			</BrowserRouter>
		</>
	);
}

export default App;
