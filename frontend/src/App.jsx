import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load students");
      }

      setStudents(await response.json());
    } catch {
      setMessage("Cannot connect to the server.");
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function addStudent(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, course })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save student");
      }

      setName("");
      setEmail("");
      setCourse("");
      setMessage("Student saved successfully!");

      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: 20
    }}>
      <h1>Student Information System</h1>

      <p>
        Add a student and save the record to MySQL through Prisma.
      </p>

      <form onSubmit={addStudent}>
        <input
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          placeholder="Course (e.g., BSIT)"
          value={course}
          onChange={e => setCourse(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Save Student</button>
      </form>

      <p role="status">{message}</p>

      <h2>Registered Students</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {students.map(student => (
            <li key={student.id}>
              {student.name} — {student.course} ({student.email})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}