from django.db import models


class wtKlientBankTemp(models.Model):
    NumDoc = models.CharField(max_length=20, null=False, blank=False)
    Date = models.DateTimeField(
        auto_now=False, auto_now_add=False, null=False, blank=False)
    Summa = models.DecimalField(
        max_digits=10, decimal_places=2, null=False, blank=False)
    MfoA = models.CharField(max_length=9, null=False, blank=False)
    NaznP = models.CharField(max_length=200, null=False, blank=False)
    service_old = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.NumDoc} | {self.NaznP}"
    

class refKlientBankStatus(models.Model):
    uid = models.IntegerField(null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return f"{self.uid} | {self.name}"