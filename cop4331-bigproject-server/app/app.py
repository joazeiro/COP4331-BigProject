from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from util.constants import Keys
from datetime import datetime, timedelta
import jwt,uuid
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from random import choice
from string import ascii_letters, digits

# Internal imports
from functions import connect

app = Flask(__name__)

# MongoDB connection
db = connect.connect_database()
app.config['MAIL_SERVER'] = Keys.MAIL_SERVER
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = Keys.MAIL_USERNAME
app.config['MAIL_PASSWORD'] = Keys.MAIL_PASSWORD
app.config['SECRET_KEY'] = Keys.SECRET_KEY

bcrypt = Bcrypt(app)
mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Auxililary functions - Not routing related

def generate_verification_token():
    # Generate a random verification token
    characters = ascii_letters + digits
    token = ''.join(choice(characters) for _ in range(32))
    return token



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

        # Generate verification token
        token = uuid.uuid4().hex[:8]

        # Create a verification link using the token
        verification_link = f"http://your-app.com/verify/{token}"

        # Send verification email
        msg = Message("Email Verification", recipients=[email])
        msg.body = f"Thank you for registering. Please click the link to verify your email: {verification_link}"
        mail.send(msg)


        # Make all the information received onto one JSON file
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password_hash,
            'username': username,
            'verified': False,
            'reset_token': ""
        }

        # Insert the user
        users.insert_one(new_user)

        return jsonify({'message': 'You were successfully registered! Check your email for the email verification.'})



@app.route("/forgot-password", methods=["POST"])
def forgot_password():
        
    users = connect.access_user_collection()

    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate a random token and store it in the user document
    token = uuid.uuid4().hex[:8]
    users.update_one({"_id": user["_id"]}, {"$set": {"reset_token": token}})

    # Send the password reset instructions to the user's email

    pwd_reset_link = f'http://your-app.com/reset-password'

    msg = Message("Password Reset Email", recipients=[email])
    msg.body = f"You have requested a password reset. Your reset token is {token}. Please go to the following link to finalize this process {pwd_reset_link}"
    mail.send(msg)

    return jsonify({"message": "Password reset instructions sent"})
    

@app.route("/reset-password", methods=["POST"])
def reset_password():
    users = connect.access_user_collection()
    token = request.json.get("token")
    new_password = request.json.get("password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    user = users.find_one({"reset_token": token})

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


@app.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    # Verify the token
    try:
        # Toke will expire after 1 hour, maybe make this bigger (?)
        email = serializer.loads(token, max_age=3600)
    except:
        # Invalid or expired token
        return jsonify({'message': 'Invalid or expired verification token.'}), 400

    # Update user's email verification status in the database
    # Your implementation here
    users = connect.access_user_collection()

    user = users.find_one({'email': email})

    if not user:
        return jsonify({"error": "Invalid email being verified"}), 404
    
    
    users.update_one(
        {"email": user["email"]},
        {"$set": {"verified": True}})
    
    return jsonify({'message': 'Email verified successfully.'})


if __name__ == '__main__':
    app.run(debug=True)
