import fetch from "unfetch";

const USER_API_URL = "api/v1/users";

export const getAllUsers = (searchText) => {
  let parameters = "?";
  if (searchText) {
    parameters += `searchText=${searchText}`;
  }
  return fetch(`${USER_API_URL}${parameters}`, {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  }).then(checkStatus);
};

export const addNewUser = (user) =>
  fetch(USER_API_URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(user),
  }).then(checkStatus);

export const updateUser = (user) =>
  fetch(`${USER_API_URL}/${user.id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "PUT",
    body: JSON.stringify(user),
  }).then(checkStatus);

export const deleteUser = (user) =>
  fetch(`${USER_API_URL}/${user.id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "DELETE",
  }).then(checkStatus);

const checkStatus = (response) => {
  if (response.ok) {
    return response.json();
  }
  // convert non-2xx HTTP responses into errors:
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};