from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import ApplicationConfig
from models import db, User, Lencana, UserLencana, Progress, Artefak, UserArtefak
import hashlib
import uuid

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

@app.before_request
def create_tables():
    """Create database tables before the first request."""
    if not hasattr(app, '_database_initialized'):
        with app.app_context():
            db.create_all()
        app._database_initialized = True

def hash_password(password):
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed_password):
    """Verify a password against its hash."""
    return hash_password(password) == hashed_password

@app.route('/')
def index():
    """Index route."""
    return jsonify({"message": "Welcome to Kodino Backend!"})

# Authentication endpoints
@app.route('/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('fullName') or not data.get('username') or not data.get('password'):
            return jsonify({"error": "Nama lengkap, username, dan password wajib diisi"}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username sudah digunakan"}), 400
        
        # Check if email already exists (if provided)
        if data.get('email') and User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email sudah digunakan"}), 400
        
        # Validate password confirmation
        if data.get('password') != data.get('confirmPassword'):
            return jsonify({"error": "Konfirmasi password tidak cocok"}), 400
        
        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            nama_panjang=data['fullName'],
            username=data['username'],
            email=data.get('email') if data.get('hasEmail') else None,
            password=hash_password(data['password']),
            dikoin=0
        )
        
        db.session.add(new_user)
        db.session.flush()  # Get the user ID
        
        # Create initial progress
        new_progress = Progress(
            id=str(uuid.uuid4()),
            user_id=new_user.id,
            section=1,
            level=1
        )
        
        db.session.add(new_progress)
        db.session.commit()
        
        return jsonify({
            "message": "Registrasi berhasil!",
            "user": {
                "id": new_user.id,
                "nama_panjang": new_user.nama_panjang,
                "username": new_user.username,
                "email": new_user.email,
                "dikoin": new_user.dikoin
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    """Login a user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('username') or not data.get('password'):
            return jsonify({"error": "Username dan password wajib diisi"}), 400
        
        # Find user by username
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not verify_password(data['password'], user.password):
            return jsonify({"error": "Username atau password salah"}), 401
        
        # Get user progress
        progress = Progress.query.filter_by(user_id=user.id).first()
        
        return jsonify({
            "message": "Login berhasil!",
            "user": {
                "id": user.id,
                "nama_panjang": user.nama_panjang,
                "username": user.username,
                "email": user.email,
                "dikoin": user.dikoin,
                "progress": {
                    "section": progress.section if progress else 1,
                    "level": progress.level if progress else 1
                } if progress else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# User management endpoints
@app.route('/users', methods=['GET'])
def get_users():
    """Get all users."""
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users])
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a user by ID."""
    try:
        user = User.query.get_or_404(user_id)
        progress = Progress.query.filter_by(user_id=user.id).first()
        
        user_data = user.serialize()
        if progress:
            user_data['progress'] = progress.serialize()
        
        return jsonify(user_data)
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users', methods=['POST'])
def create_user():
    """Create a new user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('nama_panjang') or not data.get('username') or not data.get('password'):
            return jsonify({"error": "Nama panjang, username, dan password wajib diisi"}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username sudah digunakan"}), 400
        
        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            nama_panjang=data['nama_panjang'],
            username=data['username'],
            email=data.get('email'),
            password=hash_password(data['password']),
            dikoin=data.get('dikoin', 0)
        )
        
        db.session.add(new_user)
        db.session.flush()
        
        # Create initial progress
        new_progress = Progress(
            id=str(uuid.uuid4()),
            user_id=new_user.id,
            section=1,
            level=1
        )
        
        db.session.add(new_progress)
        db.session.commit()
        
        return jsonify(new_user.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user."""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'nama_panjang' in data:
            user.nama_panjang = data['nama_panjang']
        if 'username' in data:
            # Check if new username is already taken
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({"error": "Username sudah digunakan"}), 400
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = hash_password(data['password'])
        if 'dikoin' in data:
            user.dikoin = data['dikoin']
        
        db.session.commit()
        
        return jsonify(user.serialize())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user."""
    try:
        user = User.query.get_or_404(user_id)
        
        # Delete associated progress
        Progress.query.filter_by(user_id=user_id).delete()
        
        # Delete associated user_lencana records
        UserLencana.query.filter_by(user_id=user_id).delete()
        
        # Delete associated user_artefak records
        UserArtefak.query.filter_by(user_id=user_id).delete()
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "User berhasil dihapus"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Progress endpoints
@app.route('/progress/<string:user_id>', methods=['GET'])
def get_progress(user_id):
    """Get user progress."""
    try:
        progress = Progress.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({"error": "Progress tidak ditemukan"}), 404
        
        return jsonify(progress.serialize())
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/progress/<string:user_id>', methods=['PUT'])
def update_progress(user_id):
    """Update user progress."""
    try:
        progress = Progress.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({"error": "Progress tidak ditemukan"}), 404
        
        data = request.get_json()
        
        if 'section' in data:
            progress.section = data['section']
        if 'level' in data:
            progress.level = data['level']
        
        db.session.commit()
        
        return jsonify(progress.serialize())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Lencana endpoints
@app.route('/lencana', methods=['GET'])
def get_lencana():
    """Get all lencana."""
    try:
        lencana_list = Lencana.query.all()
        return jsonify([lencana.serialize() for lencana in lencana_list])
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/lencana', methods=['POST'])
def create_lencana():
    """Create a new lencana."""
    try:
        data = request.get_json()
        
        if not data.get('nama_lencana') or not data.get('deskripsi'):
            return jsonify({"error": "Nama lencana dan deskripsi wajib diisi"}), 400
        
        new_lencana = Lencana(
            id=str(uuid.uuid4()),
            nama_lencana=data['nama_lencana'],
            deskripsi=data['deskripsi'],
            gambar=data.get('gambar')
        )
        
        db.session.add(new_lencana)
        db.session.commit()
        
        return jsonify(new_lencana.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# User Lencana endpoints
@app.route('/user-lencana/<string:user_id>', methods=['GET'])
def get_user_lencana(user_id):
    """Get user's lencana."""
    try:
        user_lencana = db.session.query(UserLencana, Lencana).join(
            Lencana, UserLencana.lencana_id == Lencana.id
        ).filter(UserLencana.user_id == user_id).all()
        
        return jsonify([{
            "id": ul.id,
            "lencana": lencana.serialize(),
            "created_at": ul.created_at.isoformat()
        } for ul, lencana in user_lencana])
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/user-lencana', methods=['POST'])
def award_lencana():
    """Award a lencana to a user."""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('lencana_id'):
            return jsonify({"error": "User ID dan Lencana ID wajib diisi"}), 400
        
        # Check if user already has this lencana
        existing = UserLencana.query.filter_by(
            user_id=data['user_id'], 
            lencana_id=data['lencana_id']
        ).first()
        
        if existing:
            return jsonify({"error": "User sudah memiliki lencana ini"}), 400
        
        new_user_lencana = UserLencana(
            id=str(uuid.uuid4()),
            user_id=data['user_id'],
            lencana_id=data['lencana_id']
        )
        
        db.session.add(new_user_lencana)
        db.session.commit()
        
        return jsonify(new_user_lencana.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Artefak endpoints
@app.route('/artefak', methods=['GET'])
def get_artefak():
    """Get all artefak."""
    try:
        artefak_list = Artefak.query.all()
        return jsonify([artefak.serialize() for artefak in artefak_list])
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/artefak', methods=['POST'])
def create_artefak():
    """Create a new artefak."""
    try:
        data = request.get_json()
        
        if not data.get('nama_artefak') or not data.get('deskripsi'):
            return jsonify({"error": "Nama artefak dan deskripsi wajib diisi"}), 400
        
        new_artefak = Artefak(
            id=str(uuid.uuid4()),
            nama_artefak=data['nama_artefak'],
            deskripsi=data['deskripsi'],
            gambar=data.get('gambar')
        )
        
        db.session.add(new_artefak)
        db.session.commit()
        
        return jsonify(new_artefak.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# User Artefak endpoints
@app.route('/user-artefak/<string:user_id>', methods=['GET'])
def get_user_artefak(user_id):
    """Get user's artefak."""
    try:
        user_artefak = db.session.query(UserArtefak, Artefak).join(
            Artefak, UserArtefak.artefak_id == Artefak.id
        ).filter(UserArtefak.user_id == user_id).all()
        
        return jsonify([{
            "id": ua.id,
            "artefak": artefak.serialize(),
            "created_at": ua.created_at.isoformat()
        } for ua, artefak in user_artefak])
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/user-artefak', methods=['POST'])
def award_artefak():
    """Award an artefak to a user."""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('artefak_id'):
            return jsonify({"error": "User ID dan Artefak ID wajib diisi"}), 400
        
        # Check if user already has this artefak
        existing = UserArtefak.query.filter_by(
            user_id=data['user_id'], 
            artefak_id=data['artefak_id']
        ).first()
        
        if existing:
            return jsonify({"error": "User sudah memiliki artefak ini"}), 400
        
        new_user_artefak = UserArtefak(
            id=str(uuid.uuid4()),
            user_id=data['user_id'],
            artefak_id=data['artefak_id']
        )
        
        db.session.add(new_user_artefak)
        db.session.commit()
        
        return jsonify(new_user_artefak.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "Kodino Backend is running"
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint tidak ditemukan"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"error": "Terjadi kesalahan internal server"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)