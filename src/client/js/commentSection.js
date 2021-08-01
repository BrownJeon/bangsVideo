import Comment from "../../models/Comment";
import Video from "../../models/Video";

const videoContainer = document.getElementById("videoContainer");
const createForm = document.getElementById("createCommentForm");
const deleteForm = document.getElementById("deleteCommentForm");

const addComment = (text, id, username) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const span = document.createElement("span");
    span.innerText =` ${username}:&nbsp;`;
    const span2 = document.createElement("span");
    span2.innerText = ` ${text}`;
    const button = document.createElement("button");
    button.innerText = "Delete";
    newComment.appendChild(span);
    newComment.appendChild(span2);
    newComment.appendChild(button);
    videoComments.prepend(newComment);
};

const createHandle = async (event) => {
    event.preventDefault();
    const inputText = createForm.querySelector("input[name='comments']");
    const text = inputText.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text })
    });

    inputText.value = "";

    if (response.status === 201) {
        inputText.value = "";
        const { newCommentId, username } = await response.json();
        addComment(text, newCommentId, username);
    }
};

const deleteHandle = (event) => {
    console.log("comment delete before");



}

if (createForm) {
    createForm.addEventListener("submit", createHandle);
}

if (deleteForm) {
    deleteForm.addEventListener("submit", deleteHandle);
}
