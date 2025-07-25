from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def generate_uuid():
    """Generate a new UUID."""
    return str(uuid4())

class User(db.Model):
    """User model."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_panjang = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    dikoin = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<User {self.username}>'
    
    def serialize(self):
        """Serialize the User object to a dictionary."""
        return {
            'id': self.id,
            'nama_panjang': self.nama_panjang,
            'username': self.username,
            'email': self.email,
            'dikoin': self.dikoin,
            'created_at': self.created_at.isoformat()
        }
        
        
class Lencana(db.Model):
    """Badge model."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_lencana = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    gambar = db.Column(db.String(200), nullable=True)  # URL or path to the badge image
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<Lencana {self.nama_lencana}>'
    
    def serialize(self):
        """Serialize the Lencana object to a dictionary."""
        return {
            'id': self.id,
            'nama_lencana': self.nama_lencana,
            'deskripsi': self.deskripsi,
            'gambar': self.gambar,
            'created_at': self.created_at.isoformat(),
        }

class UserLencana(db.Model):
    """Association model between User and Lencana."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    lencana_id = db.Column(db.String(36), db.ForeignKey('lencana.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('user_lencanas', lazy=True))
    lencana = db.relationship('Lencana', backref=db.backref('user_lencanas', lazy=True))

    def __repr__(self):
        return f'<UserLencana {self.user.username} - {self.lencana.nama_lencana}>'
    
    def serialize(self):
        """Serialize the UserLencana object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lencana_id': self.lencana_id,
            'created_at': self.created_at.isoformat(),
        }
        
class Artefak(db.Model):
    """Artefak model."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_artefak = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    gambar = db.Column(db.String(200), nullable=True)  # URL or path to the artefact image
    harga = db.Column(db.Integer, nullable=False, default=0)  # Price in dikoin
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<Artefak {self.nama_artefak}>'
    
    def serialize(self):
        """Serialize the Artefak object to a dictionary."""
        return {
            'id': self.id,
            'nama_artefak': self.nama_artefak,
            'deskripsi': self.deskripsi,
            'gambar': self.gambar,
            'created_at': self.created_at.isoformat(),
            'harga': self.harga
        }
        
class UserArtefak(db.Model):
    """Association model between User and Artefak."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    artefak_id = db.Column(db.String(36), db.ForeignKey('artefak.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('user_artefaks', lazy=True))
    artefak = db.relationship('Artefak', backref=db.backref('user_artefaks', lazy=True))

    def __repr__(self):
        return f'<UserArtefak {self.user.username} - {self.artefak.nama_artefak}>'
    
    def serialize(self):
        """Serialize the UserArtefak object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'artefak_id': self.artefak_id,
            'created_at': self.created_at.isoformat(),
        }
        
class Progress(db.Model):
    """Progress model."""
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    section = db.Column(db.Integer, nullable=False, default=1)  # Section name
    level = db.Column(db.Integer, nullable=False, default=1)  # Level of progress
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('progresses', lazy=True))

    def __repr__(self):
        return f'<Progress {self.user.username} - Level {self.level}>'
    
    def serialize(self):
        """Serialize the Progress object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'section': self.section,
            'level': self.level,
            'created_at': self.created_at.isoformat(),
        }

