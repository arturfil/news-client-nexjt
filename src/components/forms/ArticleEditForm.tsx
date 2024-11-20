"use client";

import { useState, useEffect } from "react";
import { Alert } from "../alert/Alert";
import { useUpdateArticle } from "@/hooks/useNews";

const ArticleEditForm = ({ article, states, topics }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    state: "",
    topic: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updateArticleMutation = useUpdateArticle();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        description: article.description || "",
        state: article.state || "",
        topic: article.topic || "",
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await updateArticleMutation.mutateAsync({
        id: article.id,
        data: formData,
      });
      setSuccessMessage("Article updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error">
          <p>{error}</p>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success">
          <p>{successMessage}</p>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
            minLength={5}
            maxLength={255}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black min-h-[200px]"
            minLength={10}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ArticleEditForm;
