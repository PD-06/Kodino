from app import app
from models import db, User

with app.app_context():
    try:
        # Update for your username
        username = 'rakaganteng'  # Replace with your actual username
        
        user = User.query.filter_by(username=username).first()
        if user:
            user.dikoin = 50000  # Give plenty of DiKoin for testing
            db.session.commit()
            print(f"✅ Gave 50,000 DiKoin to {user.username}")
            print(f"💰 Current balance: {user.dikoin} DC")
        else:
            print(f"❌ User '{username}' not found")
            
        # List all users for reference
        print(f"\n👥 All users:")
        all_users = User.query.all()
        for u in all_users:
            print(f"   • {u.username} ({u.nama_panjang}) - {u.dikoin} DC")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.session.rollback()