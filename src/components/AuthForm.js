import React,{ useState} from 'react';
import { authService} from 'fbase'

const inputStyles = {};

const AuthForm = () => {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [newAccount, setnewAccount] = useState(true)
    const [Error, setError] = useState("")
    const onChange = (e) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setemail(value)
        } else if (name === "password") {
            setpassword(value)
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(email, password)
            } else {
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            console.log(data)
        } catch (error) {
            setError(error.message);
        }
    }
    const toggleAccount = () => setnewAccount((prev) => !prev)
    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required value={email}
                    onChange={onChange}
                    className="authInput"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    className="authInput"
                    onChange={onChange}
                />
                <input
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "Create Account" : "Sign In"}
                />
                {Error && <span className="authError">{Error}</span>}
            </form>
            <span className="authSwitch" onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        </>
    )
}
export default AuthForm