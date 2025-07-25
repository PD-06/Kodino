# Replace the OpenAI imports with Gemini imports:

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import ApplicationConfig
from models import User, Progress, Lencana, UserLencana, Artefak, UserArtefak, ClothesSet, UserClothesSet, CourseCompletion, db, AIQuizCompletion
import hashlib
import uuid
import google.generativeai as genai  # Replace openai import
import os
import json

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

# Configure Gemini API
genai.configure(api_key='AIzaSyAyL1Gw3JQtMkA3eN5V-QgrAh9QTYmdYYY')  # Set your Gemini API key

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
        
        # Get current clothes set info
        current_clothes = None
        if user.clothe_sekarang:
            current_clothes = ClothesSet.query.get(user.clothe_sekarang)
        
        return jsonify({
            "message": "Login berhasil!",
            "user": {
                "id": user.id,
                "nama_panjang": user.nama_panjang,
                "username": user.username,
                "email": user.email,
                "dikoin": user.dikoin,
                'clothe_sekarang': user.clothe_sekarang,
                "current_clothes": current_clothes.serialize() if current_clothes else None,
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


@app.route('/clothes-set', methods=['GET'])
def get_clothes_sets():
    """Get all clothes sets."""
    try:
        clothes_sets = ClothesSet.query.all()
        return jsonify([clothes_set.serialize() for clothes_set in clothes_sets])
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/clothes-set/<string:clothes_set_id>', methods=['GET'])
def get_clothes_set(clothes_set_id):
    """Get a clothes set by ID."""
    try:
        clothes_set = ClothesSet.query.get_or_404(clothes_set_id)
        return jsonify(clothes_set.serialize())
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/clothes-set', methods=['POST'])
def create_clothes_set():
    """Create a new clothes set."""
    try:
        data = request.get_json()
        
        if not data.get('nama_set'):
            return jsonify({"error": "Nama set wajib diisi"}), 400
        
        new_clothes_set = ClothesSet(
            id=str(uuid.uuid4()),
            nama_set=data['nama_set'],
            deskripsi=data.get('deskripsi'),
            gambar=data.get('gambar'),
            harga=data.get('harga', 0)
        )
        
        db.session.add(new_clothes_set)
        db.session.commit()
        
        return jsonify(new_clothes_set.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# User ClothesSet endpoints
@app.route('/user-clothes-set/<string:user_id>', methods=['GET'])
def get_user_clothes_sets(user_id):
    """Get user's owned clothes sets."""
    try:
        user_clothes = db.session.query(UserClothesSet, ClothesSet).join(
            ClothesSet, UserClothesSet.clothes_set_id == ClothesSet.id
        ).filter(UserClothesSet.user_id == user_id).all()
        
        return jsonify([{
            "id": uc.id,
            "clothes_set": clothes_set.serialize(),
            "obtained_at": uc.obtained_at.isoformat() if uc.obtained_at else None,
            "created_at": uc.created_at.isoformat() if uc.created_at else None
        } for uc, clothes_set in user_clothes])
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/user-clothes-set', methods=['POST'])
def award_clothes_set():
    """Award a clothes set to a user."""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('clothes_set_id'):
            return jsonify({"error": "User ID dan Clothes Set ID wajib diisi"}), 400
        
        # Check if user already has this clothes set
        existing = UserClothesSet.query.filter_by(
            user_id=data['user_id'], 
            clothes_set_id=data['clothes_set_id']
        ).first()
        
        if existing:
            return jsonify({"error": "User sudah memiliki clothes set ini"}), 400
        
        new_user_clothes_set = UserClothesSet(
            id=str(uuid.uuid4()),
            user_id=data['user_id'],
            clothes_set_id=data['clothes_set_id']
        )
        
        db.session.add(new_user_clothes_set)
        db.session.commit()
        
        return jsonify(new_user_clothes_set.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users/<string:user_id>/change-clothes', methods=['PUT'])
def change_user_clothes(user_id):
    """Change user's current clothes."""
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if not data.get('clothes_set_id'):
            return jsonify({"error": "Clothes Set ID wajib diisi"}), 400
        
        # Check if user owns this clothes set
        user_clothes = UserClothesSet.query.filter_by(
            user_id=user_id, 
            clothes_set_id=data['clothes_set_id']
        ).first()
        
        if not user_clothes:
            return jsonify({"error": "User tidak memiliki clothes set ini"}), 400
        
        # Update user's current clothes
        user.clothe_sekarang = data['clothes_set_id']
        db.session.commit()
        
        return jsonify({
            "message": "Clothes berhasil diubah",
            "user": user.serialize()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/users/<string:user_id>/available-modules', methods=['GET'])
def get_available_modules(user_id):
    """Get user's available modules based on their progress."""
    try:
        progress = Progress.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({"error": "Progress tidak ditemukan"}), 404
        
        # Define all modules with their requirements
        all_modules = [
            {
                "id": "pendahuluan",
                "title": "Pendahuluan",
                "subtitle": "Dasar-dasar Programming",
                "icon": "📚",
                "required_level": 1,
                "series": "Sumatera Series"
            },
            {
                "id": "logika-dan-variabel",
                "title": "Logika dan Variabel",
                "subtitle": "Operator Logika",
                "icon": "🧠",
                "required_level": 2,
                "series": "Kalimantan Series"
            },
            {
                "id": "struktur-data-dan-interaksi",
                "title": "Struktur Data dan Interaksi",
                "subtitle": "Game dan Interaksi",
                "icon": "🎮",
                "required_level": 3,
                "series": "Sulawesi Series"
            },
            {
                "id": "struktur-program",
                "title": "Struktur Program & Pengulangan Kompleks",
                "subtitle": "Pengulangan Kompleks",
                "icon": "🔄",
                "required_level": 4,
                "series": "Papua Series"
            },
            {
                "id": "pengembangan-program",
                "title": "Pengembangan Program dan Kode Modular",
                "subtitle": "Kode Modular",
                "icon": "🏗️",
                "required_level": 5,
                "series": "Jawa Series"
            },
            {
                "id": "pemrograman-bebas",
                "title": "Pemrograman Bebas",
                "subtitle": "Kreasi Bebas",
                "icon": "🎨",
                "required_level": 6,
                "series": "Pulau Komodo Series"
            }
        ]
        
        # Filter modules based on user's level
        available_modules = []
        user_level = progress.level
        
        for module in all_modules:
            # UPDATED LOGIC: Modules are unlocked based on level, but first course of each is always accessible
            if module['required_level'] <= user_level:
                module['is_unlocked'] = True
                module['is_current'] = module['required_level'] == user_level
                available_modules.append(module)
            else:
                # Completely locked modules
                module['is_unlocked'] = False
                module['is_current'] = False
                available_modules.append(module)
        
        return jsonify({
            "user_level": user_level,
            "available_modules": available_modules
        })
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

@app.route('/course-completion/<string:user_id>', methods=['GET'])
def get_user_course_completions(user_id):
    """Get user's completed courses."""
    try:
        completions = CourseCompletion.query.filter_by(user_id=user_id).all()
        return jsonify([completion.serialize() for completion in completions])
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Update the course completion endpoint:



@app.route('/course-completion/check/<string:user_id>/<string:course_id>', methods=['GET'])
def check_course_completion(user_id, course_id):
    """Check if a specific course is completed."""
    try:
        completion = CourseCompletion.query.filter_by(
            user_id=user_id,
            course_id=course_id
        ).first()
        
        return jsonify({
            'completed': completion is not None,
            'completion_data': completion.serialize() if completion else None
        })
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

# Update the get_module_progress function:

@app.route('/course-completion/module/<string:user_id>/<string:module_id>', methods=['GET'])
def get_module_progress(user_id, module_id):
    """Get user's progress in a specific module."""
    try:
        completions = CourseCompletion.query.filter_by(
            user_id=user_id,
            module_id=module_id
        ).all()
        
        module_courses = get_module_courses(module_id)
        completed_course_ids = [c.course_id for c in completions]
        
        progress_data = []
        for i, course in enumerate(module_courses):
            is_completed = course['id'] in completed_course_ids
            # UPDATED LOGIC: First course is always unlocked, others require previous completion
            if i == 0:
                is_unlocked = True  # First course is always unlocked
            else:
                # Check if previous course is completed
                previous_course_id = module_courses[i-1]['id']
                is_unlocked = previous_course_id in completed_course_ids
            
            progress_data.append({
                'course_id': course['id'],
                'course_title': course['title'],
                'is_completed': is_completed,
                'is_unlocked': is_unlocked,
                'order': i
            })
        
        return jsonify({
            'module_id': module_id,
            'total_courses': len(module_courses),
            'completed_courses': len(completions),
            'progress_percentage': (len(completions) / len(module_courses)) * 100 if module_courses else 0,
            'courses': progress_data
        })
        
    except Exception as e:
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

def get_module_courses(module_id):
    """Helper function to get all courses in a module."""
    module_courses = {
        'pendahuluan': [
            {'id': 'pendahuluan1', 'title': 'Apa itu Ngoding?'},
            {'id': 'pendahuluan2', 'title': 'Cara Kerja Komputer'},
            {'id': 'pendahuluan3', 'title': 'Bahasa Pemrograman'},
            {'id': 'pendahuluan4', 'title': 'Ngoding itu Gimana Sih?'},
            {'id': 'pendahuluan5', 'title': 'Siap Jadi Programmer!'}
        ],
        'logika-dan-variabel': [
            {'id': 'logika1', 'title': 'Pengenalan Logika'},
            {'id': 'logika2', 'title': 'Variabel dan Tipe Data'},
            {'id': 'logika3', 'title': 'Operator Dasar'},
            {'id': 'logika4', 'title': 'Kondisi If-Else'},
            {'id': 'logika5', 'title': 'Praktik Logika'}
        ],
        'perulangan': [
            {'id': 'perulangan1', 'title': 'Konsep Perulangan'},
            {'id': 'perulangan2', 'title': 'For Loop'},
            {'id': 'perulangan3', 'title': 'While Loop'},
            {'id': 'perulangan4', 'title': 'Nested Loop'},
            {'id': 'perulangan5', 'title': 'Praktik Perulangan'}
        ]
    }
    
    return module_courses.get(module_id, [])

# Update the complete_course function:

@app.route('/course-completion', methods=['POST'])
def complete_course():
    """Mark a course as completed."""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        course_id = data.get('course_id')
        module_id = data.get('module_id')
        
        if not all([user_id, course_id, module_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if already completed
        existing = CourseCompletion.query.filter_by(
            user_id=user_id,
            course_id=course_id,
            module_id=module_id
        ).first()
        
        if existing:
            return jsonify({'message': 'Course already completed'}), 200
        
        # Create completion record
        completion = CourseCompletion(
            user_id=user_id,
            course_id=course_id,
            module_id=module_id
        )
        db.session.add(completion)
        
        # Get user for DiKoin and level updates
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Award DiKoin based on course
        if course_id == 'pendahuluan5':  # Final course gets more DiKoin
            user.dikoin += 200
        else:
            user.dikoin += 100  # Regular courses
        
        # Award badge for first module completion
        if course_id == 'pendahuluan1':
            # Award First Steps badge
            first_steps_badge = Lencana.query.filter_by(nama_lencana='First Steps').first()
            if first_steps_badge:
                existing_badge = UserLencana.query.filter_by(
                    user_id=user_id,
                    lencana_id=first_steps_badge.id
                ).first()
                
                if not existing_badge:
                    user_badge = UserLencana(
                        user_id=user_id,
                        lencana_id=first_steps_badge.id
                    )
                    db.session.add(user_badge)
        
        # Check if this is the last course in the module
        level_up_occurred = False
        if user.progress:
            module_courses = get_module_courses(module_id)
            completed_courses_count = CourseCompletion.query.filter_by(
                user_id=user_id,
                module_id=module_id
            ).count()
            
            # +1 because we're adding the current completion
            total_completed = completed_courses_count + 1
            
            # If all courses in module completed, advance to next level
            if total_completed >= len(module_courses):
                user.progress.level = min(user.progress.level + 1, 6)
                level_up_occurred = True
                
                # Award special badge for completing Pendahuluan module
                if module_id == 'pendahuluan':
                    nusantara_badge = Lencana.query.filter_by(nama_lencana='Nusantara Coder').first()
                    if nusantara_badge:
                        existing_badge = UserLencana.query.filter_by(
                            user_id=user_id,
                            lencana_id=nusantara_badge.id
                        ).first()
                        
                        if not existing_badge:
                            user_badge = UserLencana(
                                user_id=user_id,
                                lencana_id=nusantara_badge.id
                            )
                            db.session.add(user_badge)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Course completed successfully',
            'completion': completion.serialize(),
            'level_up': level_up_occurred,
            'new_level': user.progress.level if user.progress else 1,
            'dikoin_awarded': 200 if course_id == 'pendahuluan5' else 100
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add this endpoint:

@app.route('/users/<string:user_id>/level-up', methods=['POST'])
def level_up_user(user_id):
    """Level up user after completing a module."""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Initialize progress if not exists
        if not user.progress:
            user.progress = UserProgress(
                user_id=user_id,
                section=1,
                level=1
            )
            db.session.add(user.progress)
        
        # Level up
        current_level = user.progress.level
        new_level = min(current_level + 1, 6)  # Max level 6
        
        user.progress.level = new_level
        
        # If completed all levels in section, move to next section
        if new_level >= 6:
            user.progress.section = min(user.progress.section + 1, 6)  # Max 6 sections
            user.progress.level = 1  # Reset level for new section
        
        # Award additional DiKoin for level up
        user.dikoin += 50
        
        db.session.commit()
        
        return jsonify({
            'message': f'User leveled up to level {user.progress.level}',
            'user': user.serialize(),
            'previous_level': current_level,
            'new_level': user.progress.level,
            'new_section': user.progress.section
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# Replace the generate_ai_quiz function:

@app.route('/ai/generate-quiz', methods=['POST'])
def generate_ai_quiz():
    """Generate AI-powered quiz questions using Gemini."""
    try:
        data = request.get_json()
        module = data.get('module', 'pendahuluan')
        topic = data.get('topic', 'Programming Basics')
        num_mc = data.get('num_multiple_choice', 8)
        num_fill = data.get('num_fill_in_blank', 2)
        difficulty = data.get('difficulty', 'beginner')
        language = data.get('language', 'indonesian')
        
        # Create the prompt for Gemini
        prompt = f"""
        Buatlah {num_mc + num_fill} soal kuis tentang {topic} untuk siswa level {difficulty} dalam bahasa {language}.
        
        Modul: {module}
        Topik: {topic}
        
        Persyaratan:
        - {num_mc} soal pilihan ganda dengan 4 pilihan jawaban
        - {num_fill} soal isian (fill-in-the-blank)
        - Semua soal dalam bahasa Indonesia
        - Sertakan penjelasan untuk setiap jawaban
        - Fokus pada pemahaman praktis, bukan hanya hafalan
        - Buat soal yang relevan dengan konteks Indonesia
        
        Area konten yang harus dicakup:
        1. Apa itu programming/coding
        2. Cara kerja komputer (Input-Process-Output)
        3. Bahasa pemrograman
        4. Komponen komputer (CPU, RAM, Storage)
        5. Mindset dan skill programmer
        6. Konsep dasar programming
        7. Problem-solving dalam programming
        8. Tools dan resources programming
        
        Berikan respon dalam format JSON yang TEPAT seperti ini:
        {{
            "questions": [
                {{
                    "id": 1,
                    "type": "multiple-choice",
                    "question": "Teks soal dalam bahasa Indonesia",
                    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
                    "correct_answer": "Teks pilihan yang benar",
                    "explanation": "Penjelasan dalam bahasa Indonesia"
                }},
                {{
                    "id": 2,
                    "type": "fill-in-the-blank",
                    "question": "Soal dengan _____ kosong dalam bahasa Indonesia",
                    "correct_answer": "kata atau frasa yang benar",
                    "explanation": "Penjelasan dalam bahasa Indonesia"
                }}
            ]
        }}
        
        PENTING: Pastikan response adalah JSON yang valid dan dapat di-parse!
        """
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content with Gemini
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2000,
            )
        )
        
        # Parse the response
        ai_response = response.text
        
        # Clean the response text (remove markdown code blocks if present)
        if ai_response.startswith('```json'):
            ai_response = ai_response.replace('```json', '').replace('```', '').strip()
        elif ai_response.startswith('```'):
            ai_response = ai_response.replace('```', '').strip()
        
        # Parse JSON
        quiz_data = json.loads(ai_response)
        
        # Validate the structure
        if 'questions' not in quiz_data:
            raise ValueError("Invalid response structure: missing 'questions' key")
        
        # Ensure we have the right number of questions
        questions = quiz_data['questions']
        if len(questions) != (num_mc + num_fill):
            print(f"Warning: Expected {num_mc + num_fill} questions, got {len(questions)}")
        
        return jsonify(quiz_data), 200
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw response: {ai_response}")
        # Return fallback questions if JSON parsing fails
        return jsonify(get_fallback_quiz_data(num_mc, num_fill)), 200
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Return fallback questions if Gemini fails
        return jsonify(get_fallback_quiz_data(num_mc, num_fill)), 200

def get_fallback_quiz_data(num_mc=8, num_fill=2):
    """Fallback quiz data when AI generation fails."""
    questions = []
    
    # Multiple choice questions
    mc_questions = [
        {
            "id": 1,
            "type": "multiple-choice",
            "question": "Apa yang dimaksud dengan programming?",
            "options": [
                "Bermain game di komputer",
                "Memberikan instruksi kepada komputer untuk menyelesaikan tugas",
                "Memperbaiki hardware komputer",
                "Mendesain tampilan website"
            ],
            "correct_answer": "Memberikan instruksi kepada komputer untuk menyelesaikan tugas",
            "explanation": "Programming adalah proses memberikan instruksi step-by-step kepada komputer untuk menyelesaikan tugas tertentu."
        },
        {
            "id": 2,
            "type": "multiple-choice",
            "question": "Dalam analogi memasak rendang, apa yang dimaksud dengan 'Input'?",
            "options": [
                "Rendang yang sudah jadi",
                "Proses memasak",
                "Bahan-bahan seperti daging dan bumbu",
                "Kompor dan wajan"
            ],
            "correct_answer": "Bahan-bahan seperti daging dan bumbu",
            "explanation": "Input adalah data atau bahan mentah yang dimasukkan ke dalam sistem, seperti bahan-bahan masakan."
        },
        {
            "id": 3,
            "type": "multiple-choice",
            "question": "Bahasa pemrograman mana yang direkomendasikan untuk pemula?",
            "options": [
                "Assembly",
                "Python",
                "Machine Code",
                "Binary"
            ],
            "correct_answer": "Python",
            "explanation": "Python memiliki syntax yang mudah dipahami dan cocok untuk pemula belajar programming."
        },
        {
            "id": 4,
            "type": "multiple-choice",
            "question": "Apa fungsi utama CPU dalam komputer?",
            "options": [
                "Menyimpan data permanent",
                "Menampilkan gambar di layar",
                "Memproses instruksi dan data",
                "Menghubungkan ke internet"
            ],
            "correct_answer": "Memproses instruksi dan data",
            "explanation": "CPU (Central Processing Unit) berfungsi sebagai 'otak' komputer yang memproses semua instruksi dan perhitungan."
        },
        {
            "id": 5,
            "type": "multiple-choice",
            "question": "Apa perbedaan antara RAM dan Storage?",
            "options": [
                "RAM lebih cepat tapi sementara, Storage lebih lambat tapi permanent",
                "RAM dan Storage sama saja",
                "RAM untuk internet, Storage untuk aplikasi",
                "RAM lebih mahal, Storage lebih murah"
            ],
            "correct_answer": "RAM lebih cepat tapi sementara, Storage lebih lambat tapi permanent",
            "explanation": "RAM menyimpan data sementara dengan akses cepat, sedangkan Storage menyimpan data secara permanent."
        },
        {
            "id": 6,
            "type": "multiple-choice",
            "question": "Mindset apa yang paling penting untuk programmer?",
            "options": [
                "Menghafal semua syntax",
                "Bekerja sendirian",
                "Continuous learning dan problem solving",
                "Hanya fokus satu bahasa"
            ],
            "correct_answer": "Continuous learning dan problem solving",
            "explanation": "Programmer harus selalu belajar teknologi baru dan terampil memecahkan masalah dengan kreatif."
        },
        {
            "id": 7,
            "type": "multiple-choice",
            "question": "Apa yang sebaiknya dilakukan ketika menemui error dalam coding?",
            "options": [
                "Langsung menyerah",
                "Menghapus semua kode",
                "Belajar dari error dan mencari solusinya",
                "Menyalahkan komputer"
            ],
            "correct_answer": "Belajar dari error dan mencari solusinya",
            "explanation": "Error adalah bagian normal dari programming dan merupakan kesempatan belajar yang berharga."
        },
        {
            "id": 8,
            "type": "multiple-choice",
            "question": "Platform mana yang TIDAK cocok untuk belajar programming mendalam?",
            "options": [
                "GitHub",
                "Stack Overflow",
                "TikTok",
                "Codecademy"
            ],
            "correct_answer": "TikTok",
            "explanation": "Meskipun TikTok bisa memberikan tips cepat, platform lain lebih cocok untuk pembelajaran mendalam dan praktik."
        }
    ]
    
    # Fill-in-the-blank questions
    fill_questions = [
        {
            "id": 9,
            "type": "fill-in-the-blank",
            "question": "Siklus kerja komputer mengikuti pola: _____ → PROCESS → OUTPUT",
            "correct_answer": "INPUT",
            "explanation": "Komputer bekerja dengan menerima input, memprosesnya, lalu menghasilkan output."
        },
        {
            "id": 10,
            "type": "fill-in-the-blank",
            "question": "Filosofi gotong royong dalam programming berarti saling _____ dan berbagi ilmu sesama programmer.",
            "correct_answer": "membantu",
            "explanation": "Komunitas programming Indonesia menerapkan nilai gotong royong dengan saling membantu dan berbagi pengetahuan."
        }
    ]
    
    # Select the requested number of questions
    questions.extend(mc_questions[:num_mc])
    questions.extend(fill_questions[:num_fill])
    
    return {"questions": questions}

@app.route('/api/execute-python', methods=['POST'])
def execute_python():
    """
    Execute Python code with Indonesian keyword support and provide AI feedback only if there's an error.
    Request body: { "code": "python code here", "language": "indonesian" (optional) }
    Returns: { "output": "execution output", "feedback": "AI feedback (if error)", "translated_code": "english code (if indonesian)" }
    """

    # Indonesian to English keyword mapping
    keyword_map = {
        # Control Flow - Alur Kontrol
        'jika': 'if',
        'kalau': 'if',
        'lainnya': 'else',
        'selain': 'elif',
        'untuk': 'for',
        'selama': 'while',
        'ulang': 'while',
        'berhenti': 'break',
        'lanjut': 'continue',
        'lewati': 'pass',
        'coba': 'try',
        'kecuali': 'except',
        'akhirnya': 'finally',
        'angkat': 'raise',
        'lempar': 'raise',

        # Functions and Classes - Fungsi dan Kelas
        'fungsi': 'def',
        'definisi': 'def',
        'kelas': 'class',
        'kembalikan': 'return',
        'kembali': 'return',
        'hasil': 'yield',
        'lambda': 'lambda',
        'dari': 'from',
        'impor': 'import',
        'sebagai': 'as',

        # Logical Operators - Operator Logika
        'dan': 'and',
        'atau': 'or',
        'bukan': 'not',
        'tidak': 'not',
        'dalam': 'in',
        'adalah': 'is',
        'benar': 'True',
        'salah': 'False',
        'kosong': 'None',
        'nihil': 'None',

        # Context Managers - Manajer Konteks
        'dengan': 'with',

        # Assertions - Pernyataan
        'pastikan': 'assert',
        'yakin': 'assert',

        # Async - Asinkron
        'async': 'async',
        'asinkron': 'async',
        'menunggu': 'await',
        'tunggu': 'await',

        # Global/Nonlocal - Global/Nonlokal
        'global': 'global',
        'nonlokal': 'nonlocal',

        # Delete - Hapus
        'hapus': 'del',
        'buang': 'del',

        # Built-in functions - Fungsi bawaan
        'cetak': 'print',
        'tulis': 'print',
        'masukan': 'input',
        'baca': 'input',
        'panjang': 'len',
        'rentang': 'range',
        'jangkauan': 'range',
        'tipe': 'type',
        'jenis': 'type',
        'bantuan': 'help',
        'tolong': 'help',
        'buka': 'open',
        'tutup': 'close',
        'maks': 'max',
        'maksimum': 'max',
        'min': 'min',
        'minimum': 'min',
        'jumlah': 'sum',
        'total': 'sum',
        'urutkan': 'sorted',
        'sorter': 'sorted',
        'balik': 'reversed',
        'terbalik': 'reversed',
        'enumerate': 'enumerate',
        'hitung': 'enumerate',
        'zip': 'zip',
        'gabung': 'zip',
        'map': 'map',
        'petakan': 'map',
        'filter': 'filter',
        'saring': 'filter',
        'all': 'all',
        'semua': 'all',
        'any': 'any',
        'ada': 'any',
        'int': 'int',
        'bulat': 'int',
        'float': 'float',
        'desimal': 'float',
        'str': 'str',
        'teks': 'str',
        'string': 'str',
        'list': 'list',
        'daftar': 'list',
        'dict': 'dict',
        'kamus': 'dict',
        'set': 'set',
        'himpunan': 'set',
        'tuple': 'tuple',
        'pasangan': 'tuple',
        'bool': 'bool',
        'boolean': 'bool',
    }

    def translate_indonesian_to_english(code):
        """Translate Indonesian Python keywords to English."""
        lines = code.split('\n')
        translated_lines = []

        for line in lines:
            # Skip comments
            if line.strip().startswith('#'):
                translated_lines.append(line)
                continue

            # Handle string literals carefully
            result = ""
            in_string = False
            string_char = None
            i = 0

            while i < len(line):
                char = line[i]

                # Handle string boundaries
                if char in ['"', "'"] and (i == 0 or line[i-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                        string_char = None
                    result += char
                    i += 1
                    continue

                # If we're inside a string, don't translate
                if in_string:
                    result += char
                    i += 1
                    continue

                # Check if we're at the start of a potential Indonesian word
                if char.isalpha() or char == '_':
                    # Extract the word
                    word_start = i
                    while i < len(line) and (line[i].isalnum() or line[i] == '_'):
                        i += 1
                    word = line[word_start:i]

                    # Translate if it's in our mapping
                    if word in keyword_map:
                        result += keyword_map[word]
                    else:
                        result += word
                else:
                    result += char
                    i += 1

            translated_lines.append(result)

        return '\n'.join(translated_lines)

    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({"error": "No code provided"}), 400

        original_code = data['code']
        use_indonesian = data.get('language') == 'indonesian' or any(keyword in original_code for keyword in keyword_map.keys())

        # Translate Indonesian keywords to English if needed
        if use_indonesian:
            code = translate_indonesian_to_english(original_code)
            translated_code = code
        else:
            code = original_code
            translated_code = None

        # Execute the code
        try:
            import sys
            from io import StringIO
            import traceback

            # Redirect stdout and stderr
            old_stdout = sys.stdout
            old_stderr = sys.stderr
            redirected_output = StringIO()
            sys.stdout = redirected_output
            sys.stderr = redirected_output

            # Try to execute the code
            local_vars = {}
            try:
                exec(code, globals(), local_vars)
                output = redirected_output.getvalue()

                # If there's no output, check if there's a result to print
                if not output and local_vars.get('__result__'):
                    output = str(local_vars['__result__'])

                response_data = {
                    "output": output or "Code executed successfully (no output)",
                    "feedback": "",
                    "status": "success"
                }

                # Include translated code if Indonesian was used
                if translated_code:
                    response_data["translated_code"] = translated_code
                    response_data["original_language"] = "indonesian"

                return jsonify(response_data)

            except Exception as e:
                # Get the error details
                error_traceback = traceback.format_exc()
                error_type = type(e).__name__
                error_msg = str(e)

                # Create appropriate prompt based on language used
                if use_indonesian:
                    prompt = f"""
                    The following Indonesian Python code was translated to English and resulted in an error:

                    Original Indonesian code:
                    ```python
                    {original_code}
                    ```

                    Translated English code:
                    ```python
                    {code}
                    ```

                    Error: {error_type}: {error_msg}

                    Please provide feedback in both Indonesian and English:
                    1. A clear and concise explanation of what caused the error
                    2. The exact line number where the error occurred
                    3. A suggested fix for the error (show both Indonesian and English versions)
                    4. Any best practices that could prevent similar errors
                    5. No **bold** markdown formatting, and list using `-` instead of `*`

                    Format your response with Indonesian first, then English.
                    """
                else:
                    prompt = f"""
                    The following Python code resulted in an error:

                    ```python
                    {code}
                    ```

                    Error: {error_type}: {error_msg}

                    Please provide:
                    1. A clear and concise explanation of what caused the error
                    2. The exact line number where the error occurred
                    3. A suggested fix for the error
                    4. Any best practices that could prevent similar errors
                    5. No **bold** markdown formatting, and list using `-` instead of `*`
                    """

                # Only call the model if there's an error
                try:
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    response = model.generate_content(
                        prompt,
                        generation_config=genai.types.GenerationConfig(
                            temperature=0.7,
                            max_output_tokens=2000,
                        ),
                    )
                    feedback = response.text.replace(r'\*\*', '')

                    # Translate Indonesian feedback to English
                except Exception as model_error:
                    feedback = f"Error getting AI feedback: {str(model_error)}"

                response_data = {
                    "output": error_traceback,
                    "feedback": feedback,
                    "status": "error"
                }

                # Include translated code if Indonesian was used
                if translated_code:
                    response_data["translated_code"] = translated_code
                    response_data["original_language"] = "indonesian"

                return jsonify(response_data)
                
            finally:
                # Restore stdout and stderr
                sys.stdout = old_stdout
                sys.stderr = old_stderr
                
        except Exception as e:
            return jsonify({
                "error": f"Error setting up execution environment: {str(e)}",
                "status": "error"
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": f"An unexpected error occurred: {str(e)}",
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)

    