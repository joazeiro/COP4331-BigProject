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


if __name__ == '__main__':
    app.run(debug=True)
