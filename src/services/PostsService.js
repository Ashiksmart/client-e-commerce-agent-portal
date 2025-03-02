
import api from '../utils/api'

export const fetchPosts = () => {
  return api.get("/posts");
};
export const createPosts = (data) => {
  return api.post("/create-posts", data);
};
export const updatePosts = (data) => {
  return api.put("/update-posts", data);
};
export const deletePosts = (data) => {
  return api.delete("/delete-posts", data);
};
