# Generated by Django 3.2.12 on 2022-02-20 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0012_alter_location_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='user_submitted',
            field=models.BooleanField(default=False),
        ),
    ]
