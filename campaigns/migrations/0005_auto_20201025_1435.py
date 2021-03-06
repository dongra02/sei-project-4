# Generated by Django 3.1.2 on 2020-10-25 14:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('campaigns', '0004_remove_campaign_skills'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='coordinator',
        ),
        migrations.AddField(
            model_name='campaign',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='owned_campaigns', to='jwt_auth.user'),
            preserve_default=False,
        ),
    ]
