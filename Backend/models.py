from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def generate_uuid():
    """Generate a new UUID."""
    return str(uuid4())


class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_panjang = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    dikoin = db.Column(db.Integer, default=0)
    clothe_sekarang = db.Column(db.String(36), db.ForeignKey('clothes_set.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # FIXED: Removed conflicting relationships - they are defined in other models
    # The backref relationships are created automatically from the other models

    def serialize(self):
        return {
            'id': self.id,
            'nama_panjang': self.nama_panjang,
            'username': self.username,
            'email': self.email,
            'dikoin': self.dikoin,
            'clothe_sekarang': self.clothe_sekarang,
            'progress': progress_info,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class CourseCompletion(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.String(100), nullable=False)  # e.g., 'pendahuluan1', 'pendahuluan2'
    module_id = db.Column(db.String(100), nullable=False)  # e.g., 'pendahuluan', 'logika-dan-variabel'
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    user = db.relationship('User', backref=db.backref('course_completions', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'module_id': self.module_id,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ClothesSet(db.Model):
    """ClothesSet model for character costumes."""
    __tablename__ = 'clothes_set'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_set = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    gambar = db.Column(db.String(200), nullable=True)
    harga = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<ClothesSet {self.nama_set}>'
    
    def serialize(self):
        """Serialize the ClothesSet object to a dictionary."""
        return {
            'id': self.id,
            'nama_set': self.nama_set,
            'deskripsi': self.deskripsi,
            'gambar': self.gambar,
            'harga': self.harga,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Lencana(db.Model):
    """Badge model."""
    __tablename__ = 'lencana'
    
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
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserLencana(db.Model):
    """Association model between User and Lencana."""
    __tablename__ = 'user_lencana'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', name='fk_user_lencana_user'), nullable=False)
    lencana_id = db.Column(db.String(36), db.ForeignKey('lencana.id', name='fk_user_lencana_lencana'), nullable=False)
    obtained_at = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    user = db.relationship('User', backref=db.backref('user_lencana', lazy=True))
    lencana = db.relationship('Lencana', backref=db.backref('user_lencana_items', lazy=True))

    def __repr__(self):
        return f'<UserLencana {self.user_id}-{self.lencana_id}>'
    
    def serialize(self):
        """Serialize the UserLencana object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lencana_id': self.lencana_id,
            'lencana': self.lencana.serialize() if self.lencana else None,
            'obtained_at': self.obtained_at.isoformat() if self.obtained_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Artefak(db.Model):
    """Cultural artifact model."""
    __tablename__ = 'artefak'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    nama_artefak = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    gambar = db.Column(db.String(200), nullable=True)
    harga = db.Column(db.Integer, nullable=False, default=0)
    region = db.Column(db.String(50), nullable=True)  # Which region/island the artifact is from
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
            'harga': self.harga,
            'region': self.region,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserArtefak(db.Model):
    """Association model between User and Artefak."""
    __tablename__ = 'user_artefak'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', name='fk_user_artefak_user'), nullable=False)
    artefak_id = db.Column(db.String(36), db.ForeignKey('artefak.id', name='fk_user_artefak_artefak'), nullable=False)
    obtained_at = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    user = db.relationship('User', backref=db.backref('user_artefak', lazy=True))
    artefak = db.relationship('Artefak', backref=db.backref('user_artefak_items', lazy=True))

    def __repr__(self):
        return f'<UserArtefak {self.user_id}-{self.artefak_id}>'
    
    def serialize(self):
        """Serialize the UserArtefak object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'artefak_id': self.artefak_id,
            'artefak': self.artefak.serialize() if self.artefak else None,
            'obtained_at': self.obtained_at.isoformat() if self.obtained_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Progress(db.Model):
    """User progress model."""
    __tablename__ = 'progress'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', name='fk_progress_user'), nullable=False)
    section = db.Column(db.Integer, nullable=False, default=1)
    level = db.Column(db.Integer, nullable=False, default=1)
    current_module = db.Column(db.String(100), nullable=True)  # Current module being studied
    completed_modules = db.Column(db.Text, nullable=True)  # JSON string of completed modules
    last_accessed = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', backref=db.backref('progress', lazy=True, uselist=False))

    def __repr__(self):
        return f'<Progress {self.user_id} - Level {self.level}>'
    
    def serialize(self):
        """Serialize the Progress object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'section': self.section,
            'level': self.level,
            'current_module': self.current_module,
            'completed_modules': self.completed_modules,
            'last_accessed': self.last_accessed.isoformat() if self.last_accessed else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class UserClothesSet(db.Model):
    """Association model between User and ClothesSet (owned clothes)."""
    __tablename__ = 'user_clothes_set'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id', name='fk_user_clothes_set_user'), nullable=False)
    clothes_set_id = db.Column(db.String(36), db.ForeignKey('clothes_set.id', name='fk_user_clothes_set_clothes'), nullable=False)
    obtained_at = db.Column(db.DateTime, server_default=db.func.now())
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    user = db.relationship('User', backref=db.backref('user_clothes_set', lazy=True))
    clothes_set = db.relationship('ClothesSet', backref=db.backref('user_clothes_set_items', lazy=True))

    def __repr__(self):
        return f'<UserClothesSet {self.user_id}-{self.clothes_set_id}>'
    
    def serialize(self):
        """Serialize the UserClothesSet object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'clothes_set_id': self.clothes_set_id,
            'clothes_set': self.clothes_set.serialize() if self.clothes_set else None,
            'obtained_at': self.obtained_at.isoformat() if self.obtained_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Add this new model:

class AIQuizCompletion(db.Model):
    __tablename__ = 'ai_quiz_completion'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    module_id = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    time_taken = db.Column(db.Integer, nullable=False)  # in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_id': self.module_id,
            'score': self.score,
            'total_questions': self.total_questions,
            'percentage': self.percentage,
            'time_taken': self.time_taken,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }