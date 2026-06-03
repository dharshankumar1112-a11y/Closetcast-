from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
import hashlib
from .models import Outfit,OutfitPrediction
from .forms import OutfitUploadForm




# ------------------ Load model once ------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model/outfit_classifier.keras")
model = load_model(MODEL_PATH)

# Define class names (same as training)
class_names = ["Casual", "Eithic","Formal", "trad"]  # replace with your classes

# ------------------ Home page ------------------
def index(request):
    return render(request, "index.html")

# ------------------ Prediction ------------------
def predict(request):
    if request.method == "POST" and request.FILES.get('file'):
        uploaded_file = request.FILES['file']

        # Save uploaded file
        fs = FileSystemStorage()
        file_name = fs.save(uploaded_file.name, uploaded_file)
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)  # full path
        file_url = fs.url(file_name)  # URL to display in template

        # Preprocess image
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

        # Predict
        preds = model.predict(img_array)
        pred_idx = np.argmax(preds[0])
        prediction = class_names[pred_idx]
        confidence = round(float(preds[0][pred_idx] * 100), 2)

        # Save to database history
        outfit_pred = OutfitPrediction(image=file_name, predicted_class=prediction)
        outfit_pred.save()

        return render(request, "index.html", {
            "prediction": prediction,
            "confidence": confidence,
            "img_url": file_url
        })

    return render(request, "index.html")


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect("dashboard")  # redirect to dashboard page
        else:
            messages.error(request, "Invalid username or password")

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("login")


   
def register_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            messages.error(request, "Passwords do not match!")
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken!")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered!")
            return redirect("register")

        # ✅ Create user with native Django hashing
        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)

        messages.success(request, "Account created successfully!")
        return redirect("dashboard")

    return render(request, "register.html")



def dashboard(request):
    items = OutfitPrediction.objects.order_by("-created_at")
    return render(request, "dashboard.html", {"items": items})

def add_outfit(request):
    if request.method == "POST":
        form = OutfitUploadForm(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save()  # Saves image file to disk!

            # Predict using the saved file path
            img = image.load_img(obj.image.path, target_size=(224, 224))
            img_array = image.img_to_array(img) / 255.0
            img_array = np.expand_dims(img_array, 0)
            pred = model.predict(img_array)
            obj.predicted_class = class_names[np.argmax(pred)]
            obj.save()
            return redirect("dashboard")
    else:
        form = OutfitUploadForm()
    return render(request, "add_outfit.html", {"form": form})

def delete_outfit(request, pk):
    OutfitPrediction.objects.filter(pk=pk).delete()
    return redirect("dashboard")

    return render(request, 'add_outfit.html')
def home_view(request):
    outfits = Outfit.objects.all()
    return render(request, 'home.html', {'outfits': outfits})
