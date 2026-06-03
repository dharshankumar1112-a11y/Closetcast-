from django import forms
from .models import OutfitPrediction

class OutfitUploadForm(forms.ModelForm):
    class Meta:
        model = OutfitPrediction
        fields = ['image']
