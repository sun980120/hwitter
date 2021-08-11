import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { storageService, dbService } from 'fbase'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const HweetFactory = ({ userObj }) => {
    const [hweet, sethweet] = useState("")
    const [Attachment, setAttachment] = useState("")
    const onSubmit = async (e) => {
        if (hweet == "") {
            return;
        }
        e.preventDefault();
        let attachmentUrl = ""
        if (Attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
            const response = await attachmentRef.putString(Attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const newhweet = {
            text: hweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("hweets").add(newhweet)
        sethweet("");
        setAttachment("");
    }
    const onChange = (e) => {
        const { target: { value }, } = e;
        sethweet(value)
    }
    const onFileChange = (e) => {
        const { target: { files }, } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment("");
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={hweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {Attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={Attachment}
                        style={{
                            backgroundImage: Attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
}

export default HweetFactory