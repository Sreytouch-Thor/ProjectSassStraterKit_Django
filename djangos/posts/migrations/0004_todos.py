# Generated by Django 4.2.6 on 2023-10-31 07:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_roles'),
    ]

    operations = [
        migrations.CreateModel(
            name='Todos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=1000)),
                ('author', models.CharField(max_length=255)),
                ('status', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('org_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.organizations')),
            ],
        ),
    ]
