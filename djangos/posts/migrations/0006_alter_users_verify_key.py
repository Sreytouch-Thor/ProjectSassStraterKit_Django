# Generated by Django 4.2.6 on 2023-11-22 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_invites'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='verify_key',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]