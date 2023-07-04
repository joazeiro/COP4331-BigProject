# Library imports
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bcrypt import checkpw


# Internal imports
from functions import connect

app = Flask(__name__)

# MongoDB connection
db = connect.connect_database()


@app.route('/login', methods=['POST'])
def login():
    users = connect.access_user_collection()
    username = request.json.get('username')
    password = request.json.get('password')

    if username and password:
        user = users.find_one({'username': username})

        if user:
            # Compare the provided password with the stored password hash
            if checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return jsonify({'message': 'Login successful'})
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
