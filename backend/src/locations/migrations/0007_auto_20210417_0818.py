# Generated by Django 3.1.7 on 2021-04-17 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0006_auto_20210417_0815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='description',
            field=models.CharField(max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='email',
            field=models.CharField(max_length=128, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='website',
            field=models.CharField(max_length=128, null=True),
        ),
    ]
