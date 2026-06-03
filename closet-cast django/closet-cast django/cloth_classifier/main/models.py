from django.db import models

# Create your models here.

# ---------------------- Custom User Model ----------------------
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # store hashed password in production
    full_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

# ---------------------- Collections ----------------------
class Collection(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ---------------------- Outfits ----------------------
class Outfit(models.Model):
    ARTICLE_CHOICES = [
        ('Casual', 'Casual'),
        ('Eithic', 'EtEithichic'),
        ('Formal', 'Formal'),
        ('traditional', 'traditional'),
    ]

    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    article_type = models.CharField(max_length=30, choices=ARTICLE_CHOICES)
    image = models.ImageField(upload_to='outfits/')
    
    # metadata
    base_price = models.FloatField(default=0.0)
    cost = models.FloatField(default=0.0)  # manufacturing cost
    popularity = models.FloatField(null=True, blank=True)  # real popularity if available

    # predicted fields
    predicted_popularity = models.FloatField(null=True, blank=True)
    recommended_price = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.article_type})"

    @property
    def predicted_profit(self):
        """Calculate profit using recommended price and cost"""
        if self.recommended_price is None:
            return None
        return float(self.recommended_price) - float(self.cost)

# ---------------------- Orders (Optional) ----------------------
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_price = self.outfit.recommended_price * self.quantity if self.outfit.recommended_price else 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order by {self.user.username} - {self.outfit.title}"

        
class OutfitPrediction(models.Model):      
    image = models.ImageField(upload_to="outfits/")
    predicted_class = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.predicted_class} ({self.created_at:%Y-%m-%d})"
