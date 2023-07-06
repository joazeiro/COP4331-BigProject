from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from constants import Keys
from datetime import datetime, timedelta
import jwt

# Internal imports
import connect

app = Flask(__name__)

# MongoDB connection
db = connect.connect_database()

app.config['SECRET_KEY'] = Keys.SECRET_KEY

bcrypt = Bcrypt(app)

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    users = connect.access_user_collection()

    if username and password:
        user = users.find_one({'username': username})

        if user:
            stored_password = user['password']
            if bcrypt.check_password_hash(stored_password, password):
                if user['verified'] == True:
                    # Generate JWT token
                    token = jwt.encode({'id': str(user.get('_id')),'username': username,'first': user.get('first_name'),
                                    'last': user.get('last_name'), 'exp': datetime.utcnow() + timedelta(minutes=30)},
                                      app.config['SECRET_KEY'], algorithm='HS256')

                    return jsonify({'token': token})
                else:
                    return jsonify({'message':'Email Not Verified!'})
            else:
                return jsonify({'message': 'Invalid password'})

        else:
            return jsonify({'message': 'User not found'})

    else:
        return jsonify({'message': 'Username and Password are required'})


@app.route('/signup', methods=['POST'])
def signup():
    # Receiving information from front end form
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')

    # Open the DB collection that contains users
    users = connect.access_user_collection()
    if users.find_one({'email': email}):
        return jsonify({'message': 'Email is already in use, please log in'})

    # Otherwise, create a new instance of a user
    else:
        # Make all the information received onto one JSON file
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password_hash,
            'username': username,
            'verified': False
        }

        # Insert the user
        users.insert_one(new_user)

        return jsonify({'message': 'User created successfully'})



@app.route("/reset-password", methods=["POST"])
def reset_password():
        
    users = connect.access_user_collection()

    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate a random token and store it in the user document
    token = "abc123"  # Placeholder token, replace with your token generation logic
    users.update_one({"_id": user["_id"]}, {"$set": {"reset_token": token}})

    # Send the password reset instructions to the user's email
    # (code for sending email omitted for brevity)

    return jsonify({"message": "Password reset instructions sent", "token": token})
    

@app.route("/update-password", methods=["POST"])
def update_password():
    users = connect.access_user_collection()
    token = request.json.get("token")
    new_password = request.json.get("password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    user = users.collection.find_one({"reset_token": token})

    if not user:
        return jsonify({"error": "Invalid token"}), 404

    # Hash the new password before storing it
    hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    # Update the user's password and remove the reset token
    users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
    )

    return jsonify({"message": "Password updated successfully"})


if __name__ == '__main__':
    app.run(debug=True)
