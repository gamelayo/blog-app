import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "./BackButton";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Line } from "rc-progress";
import { updatePost } from "../features/post/postSlice";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import storage from "./firebaseConfig";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
const UpdatePost = () => {
  const { postId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { post, isError, isLoading, message } = useSelector(
    (state) => state.post
  );

  const [userName] = useState(user.name);
  const [title, setTitle] = useState(post?.title || " ");
  const [summary, setSummary] = useState(post?.summary || "");
  const [content, setContent] = useState(post?.content || "");

  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    const storageRef = ref(storage, `blog/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        // toast.error("error.message");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, isError, message, post]);
  const postData = { title, summary, imageUrl, userName, content };

  const onSubmit = (e) => {
    e.preventDefault();
    if (postData.imageUrl !== post.imageUrl) {
      const storageRef = ref(storage, post.imageUrl);

      deleteObject(storageRef);
    }
    dispatch(updatePost({ postId, postData }));
    navigate("/");
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="mb-12">
      <div className="w-[70%] m-auto mb-[20px]">
        <BackButton url={`/post/${postId}`} />
      </div>
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="w-[70%] m-auto"
      >
        <div className="mb-[10px] flex flex-col gap-1">
          <label className="font-semibold">Edit title</label>
          <input
            type="text"
            placeholder="title"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="mb-[10px] flex flex-col gap-1">
          <label className="font-semibold">Edit text</label>
          <input
            type="text"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            placeholder="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>
        <div className="mb-[12px] flex flex-col justify-center gap-2">
          <label>Edit Image</label>
          <Line percent={progress} strokeWidth={4} strokeColor="#B0DAFF" />
          <input
            type="file"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            onChange={handleFileChange}
          />
          {post.imageUrl === "" ? null : (
            <div>
              <label className="font-semibold">ImageUrl</label>
              <input
                type="text"
                className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
                name="imageURL"
                value={post.imageUrl}
                disabled
              />
            </div>
          )}
          <div className="flex justify-center ">
            <button
              type="button"
              className="px-4 py-2  bg-slate-500 text-white rounded-md"
              onClick={handleUpload}
            >
              Upload Image
            </button>
          </div>
        </div>
        <div className="mb-[10px] flex flex-col gap-1">
          <label className="font-semibold">Edit Content</label>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={content}
            onChange={setContent}
            className="w-[100%] p-[2px] mb-[10px] rounded border-slate-500 border-solid border z-10"
          />
        </div>
        <div className="mb-[10px] flex justify-center">
          <button
            type="submit"
            className="py-[10px] w-[100%] px-[20px] bg-black text-white cursor-pointer text-center rounded"
          >
            Edit Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
