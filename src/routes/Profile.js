import React, { useEffect, useState } from 'react'
import { authService } from 'fbase'
import { useHistory } from 'react-router-dom'
import { dbService } from 'fbase'

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setnewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut()
        history.push('/')
        refreshUser();
    }
    const getMyHweets = async () => {
        const hweets = await dbService.collection("hweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createAt")
            .get();
        console.log(hweets.docs.map((doc) => doc.data()));
    }
    useEffect(() => {
        getMyHweets();
    }, [])
    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    }
    const onChange = (e) => {
        const { target: { value }, } = e;
        setnewDisplayName(value);
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    autoFocus
                    onChange={onChange}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    )
}
export default Profile