# Document Management System - Backend API

A Node.js backend API built with Koa, TypeScript, and MySQL.

This guide walks you through running the backend on your own computer.

---

## 📋 What You Need to Install

You only need **one program**: Docker Desktop. It runs both the database and the backend server for you, automatically.

### Install Docker Desktop

1. Go to **[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)**
2. Click the big download button for your computer:
  - **Mac** — pick "Apple Silicon" if you have an M1/M2/M3/M4 Mac, or "Intel chip" for older Macs. Not sure? Click the Apple logo (top-left of your screen) → "About This Mac" and look at the "Chip" line.
  - **Windows** — download the standard installer.
3. Open the downloaded file and follow the installer.
4. After it installs, **open Docker Desktop** (from Applications on Mac, or the Start menu on Windows). Wait until the little whale icon in your menu bar / taskbar stops animating — that means Docker is ready.

> ⚠️ Docker Desktop must be running every time you want to start this project.

---

## 📥 Get the Project Files

If you already have the project folder on your computer, skip this section.

**Option A — Download as a ZIP (easiest):**

1. On the project's GitHub page, click the green **Code** button → **Download ZIP**.
2. Unzip the file. You should now have a folder called `documents-management-system-nodejs`.
3. Move it somewhere easy to find, like your **Desktop** or **Documents** folder.

**Option B — If you have Git installed:**

```bash
git clone <repository-url>
```

---

## 🚀 Run the Backend

### Step 1: Open a Terminal in the Project Folder

You need a terminal window pointed at the project folder.

**On Mac:**

1. Open **Finder** and find the `documents-management-system-nodejs` folder.
2. Right-click the folder → **Services** → **New Terminal at Folder**.
  *(If you don't see this option: open Terminal from Spotlight, type `cd`  (with a space), then drag the folder into the Terminal window and press Enter.)*

**On Windows:**

1. Open the `documents-management-system-nodejs` folder in File Explorer.
2. Click into the address bar at the top, type `cmd`, and press Enter.

### Step 2: Start Everything With One Command

In the terminal, type this and press Enter:

```bash
docker compose up --build
```

The first time, this will take **3–5 minutes** as Docker downloads and builds everything. Be patient — lots of text will scroll by, that's normal.

### Step 3: Wait for the "Server Running" Message

You're done when you see:

```
dms-app  | 🚀 Server running on port 3000
```

The backend is now live at **[http://localhost:3000](http://localhost:3000)**.

> 💡 Keep this terminal window open while you use the app. Closing it will stop the backend.

---

## 🛑 Stop the Backend

In the terminal where it's running, press **Ctrl + C** (on both Mac and Windows).

Or, in a new terminal window opened in the project folder, run:

```bash
docker compose down
```

Your data is saved — next time you run `docker compose up`, everything will still be there.

---

## 🔄 Start It Again Later

After the first build, starting up is much faster. Just run:

```bash
docker compose up
```

(No `--build` needed unless the code has changed.)

---

## 🔌 API Endpoints

Once the backend is running, these endpoints are available at `http://localhost:3000`:

### Items (Folders & Files)

**List items**

```
GET /items?parentId=1&page=1&limit=10&sort=name&search=query
```

**Create folder**

```
POST /create-folder
{
  "name": "New Folder",
  "parentId": 1,
  "createdBy": "user@example.com"
}
```

**Rename file/folder**

```
PATCH /items/:id
{ "name": "New Name" }
```

### Files

**Upload files** (supports `.pdf` and `.txt`, up to 10 files per request)

```
POST /files/upload
Content-Type: multipart/form-data
- files: [file1.pdf, file2.txt, ...]
- parentId: 1 (optional)
- createdBy: user@example.com
```

**Preview file**

```
GET /files/:id/preview
```

**Replace file**

```
PUT /files/:id/replace
Content-Type: multipart/form-data
- file: new_file.pdf
```

---

## 💾 Database Schema

The backend uses one `items` table for both folders and files:


| Column       | Type         | Notes                       |
| ------------ | ------------ | --------------------------- |
| id           | BIGINT       | Primary key                 |
| name         | VARCHAR(255) |                             |
| type         | ENUM         | `folder` or `file`          |
| parent_id    | BIGINT       | Parent folder (null = root) |
| created_by   | VARCHAR(255) |                             |
| file_size    | BIGINT       | Null for folders            |
| file_content | LONGTEXT     | Path to uploaded file       |
| created_at   | TIMESTAMP    |                             |


Uploaded files are stored in the `uploads/` folder.

---

## ✨ You're All Set

- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Frontend:** [http://localhost:3001](http://localhost:3001) *(see frontend README)*
- **Database:** MySQL on localhost:3306

