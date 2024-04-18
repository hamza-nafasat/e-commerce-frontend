import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { getUserFromDb, useLoginMutation } from "../redux/api/userApi";
import { userExist, userNotExist } from "../redux/reducers/userReducer";
import { msgResponseTypes } from "../types/api-types";

const Login = () => {
	const [gender, setGender] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<string>("");
	const [login] = useLoginMutation();
	const dispatch = useDispatch();

	const loginHandler = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const { user } = await signInWithPopup(auth, provider);
			const res = await login({
				_id: user.uid!,
				name: user.displayName!,
				dob: dateOfBirth!,
				email: user.email!,
				gender: gender!,
				photo: user.photoURL!,
			});
			if ("data" in res) {
				const data = await getUserFromDb(user.uid);
				dispatch(userExist(data.data));
				toast.success(res.data.message);
			} else {
				const error = res.error as FetchBaseQueryError;
				const data = error.data as msgResponseTypes;
				toast.error(data.message);
				dispatch(userNotExist());
			}
			setDateOfBirth("");
			setGender("");
		} catch (error) {
			console.log(error);
			toast.error("Error During Login With Firebase");
		}
	};

	return (
		<div className="loginPage">
			<main>
				<h2 className="heading">Login</h2>
				<div>
					<label htmlFor="gender">Gender</label>
					<select
						required
						name="gender"
						id="gender"
						defaultValue={gender}
						onChange={(e) => setGender(e.target.value)}
					>
						<option value="">Select</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
				<div>
					<label htmlFor="dateOfBirth">Date of birth</label>
					<input
						id="dateOfBirth"
						name="dateOfBirth"
						type="date"
						value={dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
					/>
				</div>
				<div>
					<p>Already Signed In Once</p>
					<button onClick={loginHandler}>
						<FcGoogle /> <span>Sign in with Google</span>
					</button>
				</div>
			</main>
		</div>
	);
};

export default Login;
