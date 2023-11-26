// API-logik

import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET": {
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };
    }

    case "POST": {
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };
    }

    case "PUT": {
      const putRef = await setDoc(doc(db, url, body.id), body);
      return { data: { id: putRef, ...body } };
    }

    case "DELETE": {
      const delRef = await deleteDoc(doc(db, url, body.id));
      return { data: { id: delRef, ...body } };
    }

    default: {
      throw new Error(`Unhandled method ${method}`);
    }
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    getUsers: builder.query({
      query: () => ({
        baseUrl: "",
        url: "users",
        method: "GET",
        body: "",
      }),
      providesTags: ["users"],
    }),

    editUser: builder.mutation({
      query: (User) => ({
        baseUrl: "",
        url: "users",
        method: "PUT",
        body: User,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "users",
        method: "DELETE",
        body: id,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} = usersApi;
