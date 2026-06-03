# Closet Cast - Cloth Classifier & Dashboard 👕

Closet Cast is an AI-powered fashion classification and dashboard web application built on **Django** and **TensorFlow**. It allows users to upload clothing images, classify them into fashion categories (Casual, Ethnic, Formal, Traditional) using a deep learning classifier, and track analytics and history on a responsive dashboard.

## Key Features

1. **AI Clothing Classifier**:
   - Drag-and-drop or browse files to upload images.
   - On-the-fly machine learning inference using a pre-trained Keras model.
   - Visual output of category classification and percentage confidence levels.
2. **Dynamic Admin Dashboard**:
   - Track total classifications.
   - List recent classification logs dynamically with delete controls.
   - Visual charts showing daily activity and category distribution.
3. **Tailwind Overview Portal**:
   - Secondary styled dashboard page utilizing Tailwind CSS.
4. **Secure User Authentication**:
   - Standard user registration and login systems mapped to native Django session state.

---

## Directory Structure

```text
closet-cast django/
│
├── cloth_classifier/             # Main Django Project folder
│   ├── cloth_classifier/         # Project configurations (settings, URLs, WSGI)
│   ├── main/                     # Django Application folder
│   │   ├── migrations/           # Database migration files
│   │   ├── model/                # ML Model assets (outfit_classifier.keras)
│   │   ├── templates/            # HTML templates (classifier, dashboard, auth)
│   │   ├── models.py             # Database model definitions
│   │   ├── views.py              # Application views & ML inference logic
│   │   └── urls.py               # Main app URL mappings
│   │
│   ├── static/                   # Static CSS & JS assets
│   ├── media/                    # Uploaded image directory
│   ├── db.sqlite3                # Local SQLite database
│   └── manage.py                 # Django command-line utility
│
├── requirements.txt              # Project dependencies list
└── README.md                     # Setup and running instructions
```

---

## Setup & Running Instructions

### Prerequisites
- Python 3.10, 3.11, or 3.12 installed on your system.

### 1. Extract the Project Files
Extract the project archive into a folder on your system and navigate to it in your terminal.

### 2. Create a Virtual Environment (Recommended)
Creating a virtual environment ensures dependencies do not conflict with your system-wide Python packages:

**On Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
Install all required packages from `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 4. Apply Database Migrations (Optional)
If setting up a fresh database, run the following commands to create the tables:
```bash
python cloth_classifier/manage.py migrate
```

### 5. Start the Development Server
Run the server with the `--noreload` flag (which speeds up initial TensorFlow loading by avoiding duplicate reload processes):
```bash
python cloth_classifier/manage.py runserver --noreload
```

### 6. Access the Application
Open your web browser and navigate to:
* Main Classifier: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**
* Analytics Dashboard: **[http://127.0.0.1:8000/dashboard/](http://127.0.0.1:8000/dashboard/)**
* Overview Home: **[http://127.0.0.1:8000/home/](http://127.0.0.1:8000/home/)**
