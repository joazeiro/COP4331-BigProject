# Library imports
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bcrypt import checkpw
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import jwt
import bcrypt


# Internal imports
from functions import connect

app = Flask(__name__)

# MongoDB connection
db = connect.connect_database()

app.config['SECRET_KEY'] = 'dsadasdasdas'.encode('utf-8')

# MongoDB configuration
client = MongoClient('mongodb+srv://cop4331group:SzR3ycsGck2W9PzS@bigprojectdb.39szjld.mongodb.net/')
db = client['BigProjectDatabase']
users_collection = db['userDatabase']

bcrypt = Bcrypt(app)

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if username and password:
        user = users_collection.find_one({'username': username})

        if user:
            stored_password = user['password']
            if bcrypt.check_password_hash(stored_password, password):
                # Generate JWT token
                token = jwt.encode({'id': str(user.get('_id')),'username': username,'first': user.get('first_name'),
                                    'last': user.get('last_name'), 'exp': datetime.utcnow() + timedelta(minutes=30)},
                                      app.config['SECRET_KEY'], algorithm='HS256')

                return jsonify({'token': token})
            else:
                return jsonify({'message': 'Invalid password'})
        else:
            return jsonify({'message': 'User not found'})
    else:
        return jsonify({'message': 'Username and Password are required'})
    

@app.route('/signup', methods = ['POST'])
def signup():

    # Receiving information from front end form
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')

    # Open the DB collection that contains users
    users = connect.access_user_collection()
    if users.find_one({email: 'email'}): # If this email is already registered, make them log in
        return jsonify({'message': 'Email is already in use, please log in'})

    # Otherwise, create a new instance of a user
    else:
        # Make all the information received onto one JSON file
        password = bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())
        new_user = jsonify({
            first_name: 'first_name',
            last_name: 'last_name',
            email: 'email',
            password: 'password',
            username: 'username'
        })

        # Insert the contact
        insertion = users.insert_one(new_user)


@app.route("/reset-password", methods=["POST"])
def reset_password():
    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate a random token and store it in the user document
    token = "abc123"  # Placeholder token, replace with your token generation logic
    users_collection.update_one({"_id": user["_id"]}, {"$set": {"reset_token": token}})

    # Send the password reset instructions to the user's email
    # (code for sending email omitted for brevity)

    return jsonify({"message": "Password reset instructions sent", "token": token})
    

@app.route("/update-password", methods=["POST"])
def update_password():
    token = request.json.get("token")
    new_password = request.json.get("password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    user = users_collection.find_one({"reset_token": token})

    if not user:
        return jsonify({"error": "Invalid token"}), 404

    # Hash the new password before storing it
    hashed_password = hashpw(new_password.encode("utf-8"), gensalt())

    # Update the user's password and remove the reset token
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
    )

    return jsonify({"message": "Password updated successfully"})


if __name__ == '__main__':
    app.run(debug=True)
