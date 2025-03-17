# 🏫 Campus Navigator  

Campus Navigator is a smart navigation system designed to help students, faculty, and visitors find the shortest and most efficient paths within a campus. It supports both text-based and voice-based navigation and generates visual path maps using SVGs.  

## 🚀 Features  

- 🔍 **Search for Directions** – Get the best path between buildings and rooms.  
- 🎙️ **Voice-Based Navigation** – Speak your query instead of typing.  
- 🗺️ **Dynamic Floor Maps** – Interactive SVG-based maps for easy navigation.  
- 📡 **REST API Integration** – Fetches real-time navigation paths from the backend.  
- 📦 **File Upload Support** – Users can upload audio files to get navigation results.  
- 💬 **AI-Powered Chatbot** – Provides campus-related information via chat.  

---

## 🛠️ Technologies Used  

### **Frontend**  
- ⚛️ **Next.js / React** – For building the UI.  
- 🎨 **Tailwind CSS** – For responsive and modern styling.  
- 🎤 **Web Speech API** – For voice recognition.  

### **Backend**  
- 🐍 **Flask** – Python-based web server.  
- 🔄 **RESTful API** – Handles navigation requests.  

---

## 📥 Installation & Setup  

### 1️⃣ Clone the Repository  

```sh
git clone https://github.com/Eaman006/Campus-Navigator.git
cd Campus-Navigator/my-app
```
2️⃣ Install Dependencies
Frontend
```sh
cd my-app
npm install
```

3️⃣ Run the Application
Start Frontend
```sh
npm run dev
```
Now visit http://localhost:3000/ in your browser.

📝 API Endpoints
---
| Method | Endpoint         | Description                  |
|--------|-----------------|------------------------------|
| `POST` | `/process_path` | Returns path data (JSON or SVG) |
| `POST` | `/chat`         | AI chatbot for campus queries |

🤝 Contributing
---
Fork the repository on GitHub.
Create a new branch:
```sh
git checkout -b feature-name
```
Commit your changes:
```sh
git commit -m "Added new feature"
```
Push the branch:
```sh
git push origin feature-name
```
Submit a Pull Request 🚀

📜 License
---
This project is licensed under the MIT License.
