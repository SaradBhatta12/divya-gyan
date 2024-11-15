"use client";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaClock, FaFileUpload, FaImage, FaUser } from "react-icons/fa";

interface SUBJECT {
  _id: string;
  name: string;
}
const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    duration: "",
    instructor: "",
    noOfSubjects: 0,
    noOfSemesters: 0,
    price: "",
  });

  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<SUBJECT[]>([]);
  const [sub, setSub] = useState<string[]>([]);

  const handleSubjectClick = (subjectId: string) => {
    setSub((prevSub) => {
      if (prevSub.includes(subjectId)) {
        // Remove subject ID if it's already in the array
        return prevSub.filter((id) => id !== subjectId);
      } else {
        // Add subject ID if it's not in the array
        return [...prevSub, subjectId];
      }
    });
  };
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/subject/create");
        if (response.data.success) {
          setSubjects(response.data.subjects);
        } else {
          console.error("Error fetching subjects:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === "syllabus") {
        setSyllabus(e.target.files[0]);
      } else if (e.target.name === "image") {
        setImage(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("title", formData.title);
    formdata.append("description", formData.description);
    formdata.append("duration", formData.duration);
    formdata.append("instructor", formData.instructor);
    formdata.append("price", formData.price);
    formdata.append("noOfSemesters", formData.noOfSemesters.toString());
    formdata.append("noOfSubjects", formData.noOfSubjects.toString());
    formdata.append("subjects", JSON.stringify(sub));

    if (syllabus) {
      formdata.append("syllabus", syllabus);
    }

    if (image) {
      formdata.append("image", image);
    }

    try {
      const response = await axios.post("/api/course", formdata);
      if (response) {
        toast.success(response.data.message || "Course added successfully");
      } else {
        toast.error("Error adding course");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error adding course");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1F2937] p-8 rounded-lg shadow-lg w-full max-w-4xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Add a New Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter course name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter course title"
            />
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter course description"
              rows={4}
            />
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="subjects" className="block text-gray-300">
              Subjects
            </label>
            <div className="w-full p-3 rounded border border-gray-600 bg-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex flex-wrap gap-2 cursor-pointer">
              {subjects?.map((subj) => (
                <div
                  key={subj._id}
                  className={`p-2 rounded w-fit ${
                    sub.includes(subj._id) ? "bg-green-600" : "bg-pink-600"
                  } text-white`}
                  onClick={() => handleSubjectClick(subj._id)}
                >
                  {subj.name}
                </div>
              ))}
            </div>
            {/* Debugging output */}
            <div className="mt-4 text-gray-300">
              Selected Subject IDs: {sub.join(", ")}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="noOfSemesters"
              className=" text-gray-300 flex items-center"
            >
              <FaUser className="mr-2" /> No of semesters
            </label>
            <input
              type="number"
              name="noOfSemesters"
              id="noOfSemesters"
              value={formData.noOfSemesters}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter instructor name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="noOfSubjects"
              className=" text-gray-300 flex items-center"
            >
              <FaUser className="mr-2" /> No of subjects
            </label>
            <input
              type="number"
              name="noOfSubjects"
              id="noOfSubjects"
              value={formData.noOfSubjects}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter instructor name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="duration"
              className=" text-gray-300 flex items-center"
            >
              <FaClock className="mr-2" /> Duration
            </label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter course duration"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="syllabus"
              className=" text-gray-300 flex items-center"
            >
              <FaFileUpload className="mr-2" /> Syllabus
            </label>
            <input
              type="file"
              name="syllabus"
              id="syllabus"
              onChange={handleFileChange}
              className="w-full  file:border border-gray-600 bg-[#374151]  file:border-none file:rounded-lg  file:cursor-pointer focus:outline-none border border-dotted p-4 rounded"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className=" text-gray-300 flex items-center">
              <FaImage className="mr-2" /> Featured Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              className="w-full  file:border border-gray-600 bg-[#374151]  file:border-none file:rounded-lg file:cursor-pointer focus:outline-none border border-dotted p-4 rounded"
            />
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label htmlFor="price" className="block text-gray-300">
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-[#374151]  text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter price"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default Page;
