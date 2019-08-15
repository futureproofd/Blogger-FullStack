import axios from "axios";
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG, DELETE_BLOG } from "./types";
/**
 * Async Action Creators (Redux Thunk)
 * a middleware that looks at every action that passes through the system,
 *  and if it’s a function, it calls that function.
 */

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async dispatch => {
  let res;
  let blogValues = { ...values };

  if (file) {
    const uploadConfig = await axios.get("/api/upload");
    await axios.put(uploadConfig.data.url, file, {
      headers: {
        "Content-Type": file.type
      }
    });

    blogValues.imageUrl = uploadConfig.data.key;
  }
  console.log(blogValues);
  res = await axios.post("/api/blogs", {
    ...blogValues
  });

  history.push("/blogs");
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const deleteBlog = id => async dispatch => {
  const res = await axios.delete(`/api/blogs/delete/${id}`, {
    data: { blogId: id }
  });
  dispatch({ type: DELETE_BLOG, payload: JSON.parse(res.config.data).blogId });
};

export const fetchBlogs = () => async dispatch => {
  const res = await axios.get("/api/blogs");

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
