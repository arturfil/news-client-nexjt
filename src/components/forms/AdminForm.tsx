"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateStateOrTopic } from "@/hooks/useNews";

interface FormState {
  name: string;
  abbreviation?: string;
  description?: string;
}

interface AdminFormProps {
  type: "state" | "topic";
}

export default function AdminForm({ type }: AdminFormProps) {
  const mutation = useCreateStateOrTopic(type);
  const [formState, setFormState] = useState<FormState>({ name: "" });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    e.preventDefault();
    setError("");
    setSuccess("");

    mutation.mutate(formState, {
      onSuccess: () => {
        // Reset form on success
        setFormState({ name: "" });
      },
    });

    setSuccess(`${type} created successfully!`);
    setFormState({ name: "" }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      {type === "state" && (
        <div>
          <label
            htmlFor="abbreviation"
            className="block text-sm font-medium mb-1"
          >
            Abbreviation
          </label>
          <input
            type="text"
            id="abbreviation"
            value={formState.abbreviation || ""}
            onChange={(e) =>
              setFormState({ ...formState, abbreviation: e.target.value })
            }
            className="w-full p-2 border rounded text-black"
            maxLength={2}
            required
          />
        </div>
      )}

      {type === "topic" && (
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formState.description || ""}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            className="w-full p-2 border rounded text-black"
            rows={3}
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create {type}
      </button>
    </form>
  );
}
