# Generated by Django 5.0.11 on 2025-03-13 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_refklientbankstatus"),
    ]

    operations = [
        migrations.AlterField(
            model_name="wtklientbanktemp",
            name="id",
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
