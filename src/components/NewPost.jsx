import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import storage from "./firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { createPost, reset } from "../features/post/postSlice";
import { Line } from "rc-progress";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [imageUrl, setImageUrl] = useState(null);
  const [userName] = useState(user?.name);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.post
  );

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
    if (isSuccess) {
      dispatch(reset());
    }
    dispatch(reset());
  }, [dispatch, isError, isSuccess, message]);

  const onSubmit = (e) => {
    e.preventDefault();

    const postData = { title, summary, imageUrl, userName, content };
    dispatch(createPost(postData));
    navigate("/");
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="mb-12">
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="w-[70%] m-auto"
      >
        <div className="mb-[10px]">
          <input
            type="text"
            placeholder="Title"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="mb-[10px]">
          <input
            type="text"
            placeholder="Summary"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>

        <div className="mb-[12px] flex flex-col justify-center gap-2">
          <label htmlFor="imageUrl">Image</label>
          <Line percent={progress} strokeWidth={4} strokeColor="#B0DAFF" />
          <input
            type="file"
            className="w-[100%] p-[10px] mb-[10px] rounded border-slate-500 border-solid border"
            onChange={handleFileChange}
          />
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
        <div className="mb-[10px]">
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
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
