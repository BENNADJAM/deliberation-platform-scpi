import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data.json");

const initialData = {
  users: [
    {
      id: "admin",
      role: "admin",
      name: "Chef de délibération",
      email: "admin@groupescolaireespoir.fr",
      password: "123456",
    },
  ],
  classes: [
    { id: "6a", name: "6e A", level: "6e" },
    { id: "5b", name: "5e B", level: "5e" },
  ],
  students: [
    {
      lastName: "Diop",
      firstName: "Awa",
      permanentCode: "PERM-001",
      className: "6e A",
      average: 14.5,
      status: "Admis",
      subjects: { mathematiques: 15, francais: 13 },
    },
    {
      lastName: "Sarr",
      firstName: "Moussa",
      permanentCode: "PERM-002",
      className: "6e A",
      average: 9.8,
      status: "Redoublant",
      subjects: { mathematiques: 8, francais: 10 },
    },
  ],
  subjects: [
    { id: "mathematiques", label: "Mathématiques" },
    { id: "francais", label: "Français" },
  ],
};

function readData() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(dataPath, "utf8").trim();
    if (!raw) {
      throw new Error("empty data file");
    }

    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : initialData.users,
      classes: Array.isArray(parsed.classes) ? parsed.classes : initialData.classes,
      students: Array.isArray(parsed.students) ? parsed.students : initialData.students,
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects : initialData.subjects,
    };
  } catch (error) {
    const backupPath = `${dataPath}.bak`;
    fs.copyFileSync(dataPath, backupPath);
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2), "utf8");
    console.warn(`Data file was invalid; a backup was created at ${backupPath}`);
    return initialData;
  }
}

let db = readData();

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), "utf8");
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "").trim();
  const user = db.users.find((u) => u.email.toLowerCase() === email && String(u.password) === password);

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = `demo-${user.role}-${Date.now()}`;

  return res.json({
    token,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const parts = token.split("-");
  const role = parts[1];
  const user = db.users.find((item) => item.role === role);

  if (!user) {
    return res.status(401).json({ message: "Token invalide" });
  }

  return res.json({
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  });
});

app.get("/api/classes", (req, res) => {
  res.json(db.classes);
});

app.get("/api/classes/:classId", (req, res) => {
  const classItem = db.classes.find((c) => c.id === req.params.classId);
  if (!classItem) return res.status(404).json({ message: "Classe introuvable" });
  res.json(classItem);
});

app.get("/api/classes/:classId/students", (req, res) => {
  const classItem = db.classes.find((c) => c.id === req.params.classId);
  if (!classItem) return res.status(404).json({ message: "Classe introuvable" });

  const students = db.students.filter((s) => s.className === classItem.name);
  res.json(students);
});

app.post("/api/classes/:classId/deliberate", (req, res) => {
  const classItem = db.classes.find((c) => c.id === req.params.classId);
  if (!classItem) return res.status(404).json({ message: "Classe introuvable" });

  const { decisions = [] } = req.body;
  decisions.forEach(({ permanentCode, decision }) => {
    const student = db.students.find((s) => s.permanentCode === permanentCode);
    if (student) {
      student.status = decision || student.status;
    }
  });

  saveData();
  res.json({ ok: true, updated: decisions.length });
});

app.get("/api/students", (req, res) => {
  res.json(db.students);
});

app.post("/api/students", (req, res) => {
  const student = {
    ...req.body,
    status: req.body.status || "En attente",
    subjects: req.body.subjects || {},
  };

  db.students.push(student);
  saveData();
  res.status(201).json(student);
});

app.delete("/api/students/:permanentCode", (req, res) => {
  const before = db.students.length;
  db.students = db.students.filter((s) => s.permanentCode !== req.params.permanentCode);
  saveData();
  res.json({ ok: true, deleted: before - db.students.length });
});

app.get("/api/subjects", (req, res) => {
  res.json(db.subjects);
});

app.post("/api/subjects", (req, res) => {
  const subject = { id: req.body.id, label: req.body.label };
  db.subjects.push(subject);
  saveData();
  res.status(201).json(subject);
});

app.delete("/api/subjects/:id", (req, res) => {
  const before = db.subjects.length;
  db.subjects = db.subjects.filter((s) => s.id !== req.params.id);
  saveData();
  res.json({ ok: true, deleted: before - db.subjects.length });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
