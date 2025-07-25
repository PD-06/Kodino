import os
from pathlib import Path

def get_available_images():
    """
    Get a list of all available images in /public/images/ and /public/images/artefak/
    Returns a list of image paths relative to the public directory
    """
    # Get the project root directory (assuming this file is in the Backend directory)
    project_root = Path(__file__).parent.parent
    
    # Define the public directories to search for images
    image_dirs = [
        project_root / 'Frontend' / 'public' / 'images',
        project_root / 'Frontend' / 'public' / 'images' / 'artefak'
    ]
    
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    image_paths = []
    
    for image_dir in image_dirs:
        if not image_dir.exists():
            print(f"Warning: Directory not found: {image_dir}")
            continue
            
        for root, _, files in os.walk(image_dir):
            for file in files:
                if any(file.lower().endswith(ext) for ext in allowed_extensions):
                    # Get the relative path from the public directory
                    rel_path = os.path.relpath(os.path.join(root, file), 
                                            project_root / 'Frontend' / 'public')
                    # Convert to forward slashes for web compatibility
                    web_path = rel_path.replace('\\', '/')
                    image_paths.append(web_path)
    
    return image_paths
