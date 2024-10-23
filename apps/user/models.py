from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    fullname = models.CharField(max_length=150, default='Unknown')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
        # Hash the password before saving
        if self.pk is None:  # Only hash if this is a new user
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def set_password(self, raw_password):
        """Sets the user's password after hashing it."""
        self.password = make_password(raw_password)

    def __str__(self):
        return self.fullname

    class Meta:
        db_table = 'user'
