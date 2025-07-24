from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import ApplicationConfig
from models import db, User, Lencana, UserLencana, Progress

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)
@app.before_request
def create_tables():
    """Create database tables before the first request."""
    with app.app_context():
        db.create_all()

@app.route('/')
def index():
    """Index route."""
    return jsonify({"message": "Welcome to Kodino Backend!"})
@app.route('/users', methods=['GET'])
def get_users():
    """Get all users."""
    users = User.query.all()
    return jsonify([user.serialize() for user in users])
@app.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a user by ID."""
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())
@app.route('/users', methods=['POST'])
def create_user():
    """Create a new user."""
    data = request.get_json()
    new_user = User(
        nama_panjang=data['nama_panjang'],
        username=data['username'],
        email=data.get('email'),
        password=data['password']
    )
    new_progress = Progress(
        user_id=new_user.id,
        level=1,
        pengalaman=0,
        total_koin=0
    )
    # Ensure the user ID is set before adding to the session
    new_user.progress = new_progress
    # Add the new user and progress to the session
    db.session.add(new_user)
    db.session.add(new_progress)
    db.session.commit()
    db.session.refresh(new_user)  # Refresh to get the ID
    db.session.refresh(new_progress)  # Refresh to get the progress ID
    new_user.progress_id = new_progress.id  # Set the progress ID in the user object
    db.session.commit()  # Commit the changes to the database
    # Return the serialized user object
    return jsonify(new_user.serialize()), 201

@app.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user by ID."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.nama_panjang = data.get('nama_panjang', user.nama_panjang)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify(user.serialize())

@app.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user by ID."""
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 204
@app.route('/users/<string:user_id>/progress', methods=['GET'])
def get_user_progress(user_id):
    """Get progress for a specific user."""
    user = User.query.get_or_404(user_id)
    return jsonify(user.progress.serialize())
@app.route('/users/<string:user_id>/progress', methods=['POST'])
def create_user_progress(user_id):
    """Create progress for a specific user."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    new_progress = Progress(
        user_id=user.id,
        section=data.get('section', 1),
        level=data.get('level', 1)
    )
    db.session.add(new_progress)
    db.session.commit()
    return jsonify(new_progress.serialize()), 201

@app.route('/users/<string:user_id>/progress/<string:progress_id>', methods=['PUT'])
def update_user_progress(user_id, progress_id):
    """Update progress for a specific user."""
    user = User.query.get_or_404(user_id)
    progress = Progress.query.get_or_404(progress_id)
    data = request.get_json()
    progress.section = data.get('section', progress.section)
    progress.level = data.get('level', progress.level)
    db.session.commit()
    return jsonify(progress.serialize())
@app.route('/users/<string:user_id>/progress/<string:progress_id>', methods=['DELETE'])
def delete_user_progress(user_id, progress_id):
    """Delete progress for a specific user."""
    user = User.query.get_or_404(user_id)
    progress = Progress.query.get_or_404(progress_id)
    db.session.delete(progress)
    db.session.commit()
    return jsonify({"message": "Progress deleted successfully"}), 204
@app.route('/lencana', methods=['GET'])
def get_lencana():
    """Get all lencana."""
    lencana = Lencana.query.all()
    return jsonify([l.serialize() for l in lencana])
@app.route('/lencana/<string:lencana_id>', methods=['GET'])
def get_lencana_by_id(lencana_id):
    """Get a lencana by ID."""
    lencana = Lencana.query.get_or_404(lencana_id)
    return jsonify(lencana.serialize())
@app.route('/lencana', methods=['POST'])
def create_lencana():
    """Create a new lencana."""
    data = request.get_json()
    new_lencana = Lencana(
        nama_lencana=data['nama_lencana'],
        deskripsi=data.get('deskripsi'),
        gambar=data.get('gambar')
    )
    db.session.add(new_lencana)
    db.session.commit()
    return jsonify(new_lencana.serialize()), 201
@app.route('/lencana/<string:lencana_id>', methods=['PUT'])
def update_lencana(lencana_id):
    """Update a lencana by ID."""
    lencana = Lencana.query.get_or_404(lencana_id)
    data = request.get_json()
    lencana.nama_lencana = data.get('nama_lencana', lencana.nama_lencana)
    lencana.deskripsi = data.get('deskripsi', lencana.deskripsi)
    lencana.gambar = data.get('gambar', lencana.gambar)
    db.session.commit()
    return jsonify(lencana.serialize())
@app.route('/lencana/<string:lencana_id>', methods=['DELETE'])
def delete_lencana(lencana_id):
    """Delete a lencana by ID."""
    lencana = Lencana.query.get_or_404(lencana_id)
    db.session.delete(lencana)
    db.session.commit()
    return jsonify({"message": "Lencana deleted successfully"}), 204
@app.route('/users/<string:user_id>/lencana', methods=['GET'])
def get_user_lencana(user_id):
    """Get all lencana for a specific user."""
    user = User.query.get_or_404(user_id)
    return jsonify([ul.serialize() for ul in user.user_lencanas])
@app.route('/users/<string:user_id>/lencana/<string:lencana_id>', methods=['POST'])
def add_user_lencana(user_id, lencana_id):
    """Add a lencana to a specific user."""
    user = User.query.get_or_404(user_id)
    lencana = Lencana.query.get_or_404(lencana_id)
    user_lencana = UserLencana(user=user, lencana=lencana)
    db.session.add(user_lencana)
    db.session.commit()
    return jsonify(user_lencana.serialize()), 201
@app.route('/users/<string:user_id>/lencana/<string:lencana_id>', methods=['DELETE'])
def remove_user_lencana(user_id, lencana_id):
    """Remove a lencana from a specific user."""
    user = User.query.get_or_404(user_id)
    user_lencana = UserLencana.query.filter_by(user_id=user.id, lencana_id=lencana_id).first_or_404()
    db.session.delete(user_lencana)
    db.session.commit()
    return jsonify({"message": "Lencana removed successfully"}), 204
@app.route('/users/<string:user_id>/lencana/<string:lencana_id>', methods=['GET'])
def get_user_lencana_by_id(user_id, lencana_id):
    """Get a specific lencana for a user."""
    user = User.query.get_or_404(user_id)
    user_lencana = UserLencana.query.filter_by(user_id=user.id, lencana_id=lencana_id).first_or_404()
    return jsonify(user_lencana.serialize())
@app.route('/users/<string:user_id>/lencana/<string:lencana_id>', methods=['PUT'])
def update_user_lencana(user_id, lencana_id):
    """Update a specific lencana for a user."""
    user = User.query.get_or_404(user_id)
    user_lencana = UserLencana.query.filter_by(user_id=user.id, lencana_id=lencana_id).first_or_404()
    data = request.get_json()
    user_lencana.created_at = data.get('created_at', user_lencana.created_at)
    db.session.commit()
    return jsonify(user_lencana.serialize())
@app.route('/artefak', methods=['GET'])
def get_artefak():
    """Get all artefak."""
    artefak = Artefak.query.all()
    return jsonify([a.serialize() for a in artefak])
@app.route('/artefak/<string:artefak_id>', methods=['GET'])
def get_artefak_by_id(artefak_id):
    """Get an artefak by ID."""
    artefak = Artefak.query.get_or_404(artefak_id)
    return jsonify(artefak.serialize())
@app.route('/artefak', methods=['POST'])
def create_artefak():
    """Create a new artefak."""
    data = request.get_json()
    new_artefak = Artefak(
        nama_artefak=data['nama_artefak'],
        deskripsi=data.get('deskripsi'),
        gambar=data.get('gambar')
    )
    db.session.add(new_artefak)
    db.session.commit()
    return jsonify(new_artefak.serialize()), 201
@app.route('/artefak/<string:artefak_id>', methods=['PUT'])
def update_artefak(artefak_id):
    """Update an artefak by ID."""
    artefak = Artefak.query.get_or_404(artefak_id)
    data = request.get_json()
    artefak.nama_artefak = data.get('nama_artefak', artefak.nama_artefak)
    artefak.deskripsi = data.get('deskripsi', artefak.deskripsi)
    artefak.gambar = data.get('gambar', artefak.gambar)
    db.session.commit()
    return jsonify(artefak.serialize())
@app.route('/artefak/<string:artefak_id>', methods=['DELETE'])
def delete_artefak(artefak_id):
    """Delete an artefak by ID."""
    artefak = Artefak.query.get_or_404(artefak_id)
    db.session.delete(artefak)
    db.session.commit()
    return jsonify({"message": "Artefak deleted successfully"}), 204
if __name__ == '__main__':
    app.run(debug=True, port=8000) # Set debug=True for development