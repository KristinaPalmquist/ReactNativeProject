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
      // const likes = [...data];
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

export const likesApi = createApi({
  reducerPath: "likesApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["likes"],
  endpoints: (builder) => ({
    createLike: builder.mutation({
      query: ({ like }) => ({
        baseUrl: "",
        url: "likes",
        method: "POST",
        body: like,
      }),
      invalidatesTags: ["likes"],
    }),
    getLikes: builder.query({
      query: () => ({
        baseUrl: "",
        url: "likes",
        method: "GET",
        body: "",
      }),
      providesTags: ["likes"],
    }),

    editLike: builder.mutation({
      query: (Like) => ({
        baseUrl: "",
        url: "likes",
        method: "PUT",
        body: Like,
      }),
    }),
    deleteLike: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "likes",
        method: "DELETE",
        body: id,
      }),
    }),
  }),
});

export const {
  useCreateLikeMutation,
  useGetLikesQuery,
  useDeleteLikeMutation,
  useEditLikeMutation,
} = likesApi;
