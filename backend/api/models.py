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
    service_id = models.IntegerField(null=True, blank=True)
    service_old = models.IntegerField(null=True, blank=True)
    status = models.IntegerField(null=True, blank=True, default=1)
    NameB = models.CharField(max_length=50, null=False,
                             blank=False, default='ДНIПРО.ТВ ТОВ')

    def __str__(self):
        return f"{self.NumDoc} | {self.NaznP}"


class refKlientBankStatus(models.Model):
    id = models.IntegerField(primary_key=True, null=False, blank=False)
    name = models.CharField(max_length=200, null=False, blank=False)

    class Meta(object):
        managed = False
        db_table = "refKlientBankStatus"
        db_tablespace = 'Bill'

    def __str__(self):
        return f"{self.id} | {self.name}"


class refCity(models.Model):
    id = models.IntegerField(primary_key=True, blank=False)
    name = models.CharField(max_length=50, blank=False)
    net = models.BooleanField(blank=True)
    type = models.IntegerField(blank=False)
    postindex = models.IntegerField(blank=True)
    connect_tarif = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True)
    name_ukr = models.CharField(max_length=50, blank=True)
    name_ii = models.CharField(max_length=250, blank=False)

    class Meta(object):
        managed = False
        db_table = "refCity"
        db_tablespace = 'Bill'

    def __str__(self):
        return self.name


class refStreet(models.Model):
    id = models.IntegerField(primary_key=True, blank=False)
    city = models.IntegerField(blank=False)
    keyname = models.CharField(max_length=50, blank=False)
    fullname = models.CharField(max_length=100, blank=False)
    oldname = models.CharField(max_length=100, blank=True)
    net = models.BooleanField(blank=True)
    type = models.IntegerField(blank=False)
    oldcity = models.IntegerField(blank=True)
    connect_tarif = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True)
    keyname_ukr = models.CharField(max_length=50, blank=True)
    keyname_ii = models.CharField(max_length=250, blank=False)

    class Meta(object):
        managed = False
        db_table = "refStreet"
        db_tablespace = 'Bill'

    def __str__(self):
        return self.fullname


class refHouse(models.Model):
    id = models.IntegerField(primary_key=True, blank=False)
    region = models.IntegerField(blank=False)
    street = models.IntegerField(blank=False)
    house = models.CharField(max_length=50, blank=False)
    h_type = models.IntegerField(blank=True)
    zip = models.CharField(max_length=6, blank=False)
    floors = models.IntegerField(blank=True)
    subfloor = models.IntegerField(blank=True)
    topfloor = models.IntegerField(blank=True)
    techfloor = models.IntegerField(blank=True)
    entrances = models.IntegerField(blank=True)
    tp = models.IntegerField(blank=True)
    tp_s = models.IntegerField(blank=True)
    maintainer = models.IntegerField(blank=True)
    map_url = models.CharField(max_length=250, blank=True)
    region2 = models.IntegerField(blank=True)
    nflats = models.IntegerField(blank=True)
    notes = models.TextField(blank=True)
    net = models.BooleanField(blank=True)
    hide = models.BooleanField(blank=True)
    connect_tarif = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True)

    class Meta(object):
        managed = False
        db_table = "refHouse"
        db_tablespace = 'Bill'

    def __str__(self):
        return self.house


class refLocation(models.Model):
    id = models.AutoField(primary_key=True)
    house = models.IntegerField(blank=False)
    type = models.IntegerField(blank=False)
    flr = models.IntegerField(blank=True)
    entrance = models.CharField(max_length=20, blank=True)
    room = models.CharField(max_length=50, blank=False)
    notes = models.TextField(blank=True)
    connect_tarif = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True)

    class Meta(object):
        managed = False
        db_table = "refLocation"
        db_tablespace = 'Bill'

    def __str__(self):
        return self.room


class refClient(models.Model):
    id = models.IntegerField(primary_key=True, blank=False)
    dt0 = models.DateTimeField(blank=False)
    dt1 = models.DateTimeField(blank=False)
    keyname = models.CharField(max_length=100, blank=False)
    fullname = models.CharField(max_length=500, blank=False)
    location = models.IntegerField(blank=False)
    grp = models.IntegerField(blank=False)
    type = models.IntegerField(blank=False)
    paymenttype = models.IntegerField(blank=False)
    max_credit = models.DecimalField(max_digits=10, decimal_places=2)
    saccount = models.CharField(max_length=6, blank=False)
    spwd = models.CharField(max_length=50, blank=False)
    rtxid = models.IntegerField(blank=True)
    dctype = models.IntegerField(blank=True)
    curstate = models.IntegerField(blank=False)
    i_usr = models.CharField(max_length=128, blank=False)
    i_dt = models.DateTimeField(blank=False)
    c_usr = models.CharField(max_length=128, blank=False)
    c_dt = models.DateTimeField(blank=True)
    lawlocation = models.IntegerField(blank=True)
    postlocation = models.IntegerField(blank=True)
    gen_invoice = models.IntegerField(blank=True)
    npwd = models.IntegerField(blank=True)
    beznal = models.IntegerField(blank=True)
    mode = models.IntegerField(blank=True)
    keyname_ukr = models.CharField(max_length=100, blank=False)
    talk_lang = models.IntegerField(blank=False)
    num_rings = models.IntegerField(blank=True)
    last_ring = models.DateTimeField(blank=True)
    last_lk_dt = models.DateTimeField(blank=True)
    last_lk_ip = models.IntegerField(blank=True)

    class Meta(object):
        managed = False
        db_table = "refClient"
        db_tablespace = 'Bill'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.saccount:
            self.saccount = '0' + str(self.id)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.keyname
