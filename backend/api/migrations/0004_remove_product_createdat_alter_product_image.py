# Generated by Django 4.1.13 on 2024-04-16 12:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_alter_product_category"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="createdAt",
        ),
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.CharField(max_length=255, null=True),
        ),
    ]
