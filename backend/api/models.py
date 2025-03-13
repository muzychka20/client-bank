from django.db import models


class wtKlientBankTemp(models.Model):
    id = models.IntegerField(primary_key=True)
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
    id = models.IntegerField(primary_key=True, null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)

    class Meta(object):
        managed       = False
        db_table      = "refKlientBankStatus"
        db_tablespace = 'Bill'

    def __str__(self):
        return f"{self.id} | {self.name}"


class refCity(models.Model):
    id            = models.IntegerField(primary_key=True, blank = False)
    name          = models.CharField(max_length=50, blank = False)
    net           = models.BooleanField(blank = True)
    type          = models.IntegerField(blank = False)
    postindex     = models.IntegerField(blank = True)
    connect_tarif = models.DecimalField(max_digits=10, decimal_places=2, blank = True)
    name_ukr      = models.CharField(max_length=50, blank = True)
    name_ii       = models.CharField(max_length=250, blank = False)

    class Meta(object):
        managed       = False
        db_table      = "refCity"
        db_tablespace = 'Bill'
    def __str__(self):
        return self.name
    

class refStreet(models.Model):
    id            = models.IntegerField(primary_key=True, blank = False)
    city          = models.IntegerField(blank = False)
    keyname       = models.CharField(max_length=50, blank = False)
    fullname      = models.CharField(max_length=100, blank = False)
    oldname       = models.CharField(max_length=100, blank = True)
    net           = models.BooleanField(blank = True)
    type          = models.IntegerField(blank = False)
    oldcity       = models.IntegerField(blank = True)
    connect_tarif = models.DecimalField(max_digits=10, decimal_places=2, blank = True)
    keyname_ukr   = models.CharField(max_length=50, blank = True)
    keyname_ii    = models.CharField(max_length=250, blank = False)

    class Meta(object):
        managed       = False
        db_table      = "refStreet"
        db_tablespace = 'Bill'
    def __str__(self):
        return self.fullname
    
    
class refHouse(models.Model):
    id            = models.IntegerField(primary_key=True, blank = False)
    region        = models.IntegerField(blank = False)
    street        = models.IntegerField(blank = False)
    house         = models.CharField(max_length=50, blank = False)
    h_type        = models.IntegerField(blank = True)
    zip           = models.CharField(max_length=6, blank = False)
    floors        = models.IntegerField(blank = True)
    subfloor      = models.IntegerField(blank = True)
    topfloor      = models.IntegerField(blank = True)
    techfloor     = models.IntegerField(blank = True)
    entrances     = models.IntegerField(blank = True)
    tp            = models.IntegerField(blank = True)
    tp_s          = models.IntegerField(blank = True)
    maintainer    = models.IntegerField(blank = True)
    map_url       = models.CharField(max_length=250, blank = True)
    region2       = models.IntegerField(blank = True)
    nflats        = models.IntegerField(blank = True)
    notes         = models.TextField(blank = True)
    net           = models.BooleanField(blank = True)
    hide          = models.BooleanField(blank = True)
    connect_tarif = models.DecimalField(max_digits=10, decimal_places=2, blank = True)

    class Meta(object):
        managed       = False
        db_table      = "refHouse"
        db_tablespace = 'Bill'
    def __str__(self):
        return self.house
    
    
class refLocation(models.Model):
    id            = models.AutoField(primary_key=True)
    house         = models.IntegerField(blank = False)
    type          = models.IntegerField(blank = False)
    flr           = models.IntegerField(blank = True)
    entrance      = models.CharField(max_length=20, blank = True)
    room          = models.CharField(max_length=50, blank = False)
    notes         = models.TextField(blank = True)
    connect_tarif = models.DecimalField(max_digits=10, decimal_places=2, blank = True)

    class Meta(object):
        managed       = False
        db_table      = "refLocation"
        db_tablespace = 'Bill'
    def __str__(self):
        return self.room        