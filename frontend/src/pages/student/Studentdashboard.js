import React, { useEffect, useState } from "react";
import StudentNav from "../nav/studenttop";
import BASE_URL from "../../baseurl";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/student/profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setProfile(data.user);
        else console.error(data.message);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <StudentNav user={profile} />
      <h1>Welcome, {profile?.name || "Student"}</h1>
    </div>
  );
}
