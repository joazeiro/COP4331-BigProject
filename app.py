from flask import Flask, request, jsonify
from pymongo import MongoClient
from bcrypt import checkpw

app = Flask(__name__)

# MongoDB configuration
client = MongoClient('mongodb+srv://cop4331group:SzR3ycsGck2W9PzS@bigprojectdb.39szjld.mongodb.net/')
db = client['BigProjectDatabase']
users_collection = db['userDatabase']

@app.route('/login', methods=['GET','POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if username and password:
        user = users_collection.find_one({'username': username})
        print(user['password'])
        if user:
            # Compare the provided password with the stored password hash
            if checkpw(password.encode('utf-8'), user['password'].encode("utf-8")):
                return jsonify({'message': 'Login successful'})
            else:
                return jsonify({'message': 'Invalid password'})
        else:
            return jsonify({'message': 'User not found'})
    else:
        return jsonify({'message': 'Username and Password are required'})

if __name__ == '__main__':
    app.run(debug=True)
