"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", name);

    if (image) {
      formData.append("image", image);
    }

    await fetch("/api/profile", {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    alert("Profile updated");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Edit Profile</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
}