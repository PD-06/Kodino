import os 

class ApplicationConfig:
    SECRET_KEY='uahdfuhwefr92yrhp283yrp11evfqlygr018o7gr31806rg198oe1'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    
