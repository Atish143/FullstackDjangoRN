from django.db import models


class Category(models.Model):
    name  = models.CharField(max_length=100)
    icon  = models.CharField(max_length=10, blank=True)   # emoji icon e.g. 🍫
    slug  = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name         = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    price        = models.DecimalField(max_digits=10, decimal_places=2)
    image_url    = models.URLField(blank=True)          # external URL (e.g. Freepik)
    image        = models.ImageField(upload_to='products/', blank=True, null=True)  # uploaded file
    is_available = models.BooleanField(default=True)
    is_featured  = models.BooleanField(default=False)
    rating       = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def display_image(self):
        """Returns uploaded image URL first, falls back to image_url."""
        if self.image:
            return self.image.url
        return self.image_url