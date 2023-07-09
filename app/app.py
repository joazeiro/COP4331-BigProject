from flask import Flask, request, jsonify, url_for
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from constants import Keys
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from random import choice
from string import ascii_letters, digits

# Internal imports
import connect
import jwt,uuid
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)

# MongoDB connection
db = connect.connect_database()
app.config['MAIL_SERVER'] = Keys.MAIL_SERVER
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = "noreply.geobook@gmail.com"
app.config['MAIL_USERNAME'] = Keys.MAIL_USERNAME
app.config['MAIL_PASSWORD'] = Keys.MAIL_PASSWORD
app.config['SECRET_KEY'] = Keys.SECRET_KEY


bcrypt = Bcrypt(app)
mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])


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
        verification_link = f"http://127.0.0.1:5000/verify/{token}"

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
            'reset_token': "",
            'verify_token': token
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
    pwd_reset_link = f'http://127.0.0.1:5000/reset-password'

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
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Update the user's password and remove the reset token
    users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
    )

    return jsonify({"message": "Password updated successfully"})


@app.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    # Verify the token

    users = connect.access_user_collection()

    user = users.find_one({'verify_token': token})

    if not user:
        return jsonify({"error": "Invalid email being verified"}), 404
    
    users.update_one(
        {"email": user["email"]},
        {"$set": {"verified": True}})
    
    return jsonify({'message': 'Email verified successfully.'})

@app.route('/new-post', methods=['POST'])
def new_post():
    author = request.json.get("username")
    title = request.json.get("title")
    content = request.json.get("body")
    tag = request.json.get("tag")

    posts = connect.access_post_collection()

    new_post = {'author':author, 'title': title, 'content':content, 'tag':tag, 'comments':[]}

    posts.insert_one(new_post)

    post = posts.find_one({'content':content})

    return jsonify({'message':"Post Added."})

@app.route('/edit-post', methods=['POST'])
def edit_post():
    post_id = request.json.get('id')
    new_title = request.json.get('title')
    new_body = request.json.get("body")
    new_tag = request.json.get("tag")

    posts = connect.access_post_collection()
    post = posts.find_one({'_id':ObjectId(post_id)})
    
    posts.update_one({'_id':ObjectId(post_id)}, {'$set':{'title':new_title,'content':new_body, 'tag':new_tag}})

    return jsonify({'message':"Edit Successful"})

@app.route('/new-comment',methods = ['POST'])
def new_comment():
    
    id = request.json.get("id")
    author = request.json.get("username")
    content = request.json.get("body") 
    posted = datetime.now().strftime("%d-%m-%Y")

    posts = connect.access_post_collection()

    post = posts.find_one({"_id":ObjectId(id)})

    comment = {'id':ObjectId(id), 'author':author, "content":content, 'posted':posted }
    post["comments"].append(comment)

    posts.update_one({'_id': ObjectId(id)}, {'$set': {'comments': post['comments']}})

    return jsonify({"message":"Comment Added."})
  

if __name__ == '__main__':
    app.run(debug=True)
