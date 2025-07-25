from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import ApplicationConfig
from models import User, Progress, Lencana, UserLencana, Artefak, UserArtefak, ClothesSet, UserClothesSet, CourseCompletion, db
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
            elif module['required_level'] == user_level + 1:
                # Show next module as available but with limited access
                module['is_unlocked'] = True  # Module is accessible
                module['is_current'] = False
                module['is_next'] = True
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

@app.route('/course-completion', methods=['POST'])
def complete_course():
    """Mark a course as completed."""
    try:
        data = request.get_json()
        
        if not data.get('user_id') or not data.get('course_id') or not data.get('module_id'):
            return jsonify({"error": "User ID, Course ID, dan Module ID wajib diisi"}), 400
        
        # Check if course already completed
        existing = CourseCompletion.query.filter_by(
            user_id=data['user_id'],
            course_id=data['course_id']
        ).first()
        
        if existing:
            return jsonify({"error": "Course sudah diselesaikan"}), 400
        
        # Create course completion record
        completion = CourseCompletion(
            user_id=data['user_id'],
            course_id=data['course_id'],
            module_id=data['module_id']
        )
        
        db.session.add(completion)
        
        # Update user progress if completing a module
        user = User.query.get(data['user_id'])
        if user and user.progress:
            # Check if all courses in current module are completed
            module_courses = get_module_courses(data['module_id'])
            completed_courses = CourseCompletion.query.filter_by(
                user_id=data['user_id'],
                module_id=data['module_id']
            ).count()
            
            # If all courses in module completed, advance to next level
            if completed_courses + 1 >= len(module_courses):  # +1 for current completion
                user.progress.level = min(user.progress.level + 1, 6)
        
        db.session.commit()
        
        return jsonify(completion.serialize()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Terjadi kesalahan: {str(e)}"}), 500

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
            is_unlocked = i == 0 or (i > 0 and module_courses[i-1]['id'] in completed_course_ids)
            
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
            {'id': 'logika1', 'title': 'Pengenalan Variabel'},
            {'id': 'logika2', 'title': 'Tipe Data'},
            {'id': 'logika3', 'title': 'Operator Matematika'},
            {'id': 'logika4', 'title': 'Operator Logika'},
            {'id': 'logika5', 'title': 'Kondisi dan Percabangan'}
        ],
        'perulangan': [
            {'id': 'perulangan1', 'title': 'Pengenalan Perulangan'},
            {'id': 'perulangan2', 'title': 'For Loop'},
            {'id': 'perulangan3', 'title': 'While Loop'},
            {'id': 'perulangan4', 'title': 'Nested Loop'},
            {'id': 'perulangan5', 'title': 'Break dan Continue'}
        ],
        'struktur-data-dan-interaksi': [
            {'id': 'struktur1', 'title': 'Array dan List'},
            {'id': 'struktur2', 'title': 'Object dan Dictionary'},
            {'id': 'struktur3', 'title': 'Event Handling'},
            {'id': 'struktur4', 'title': 'Game Development Basics'},
            {'id': 'struktur5', 'title': 'User Interaction'}
        ],
        'pengembangan-program': [
            {'id': 'pengembangan1', 'title': 'Functions dan Methods'},
            {'id': 'pengembangan2', 'title': 'Modular Programming'},
            {'id': 'pengembangan3', 'title': 'Error Handling'},
            {'id': 'pengembangan4', 'title': 'Code Organization'},
            {'id': 'pengembangan5', 'title': 'Best Practices'}
        ],
        'pemrograman-bebas': [
            {'id': 'bebas1', 'title': 'Project Planning'},
            {'id': 'bebas2', 'title': 'Creative Coding'},
            {'id': 'bebas3', 'title': 'Personal Projects'},
            {'id': 'bebas4', 'title': 'Portfolio Building'},
            {'id': 'bebas5', 'title': 'Final Showcase'}
        ]
    }
    
    return module_courses.get(module_id, [])


if __name__ == '__main__':
    app.run(debug=True, port=8000)
    
    