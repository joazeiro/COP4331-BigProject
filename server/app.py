from flask import Flask, request, jsonify, url_for
from bson import ObjectId
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, timezone
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from random import choice
from string import ascii_letters, digits
from jwt.exceptions import ExpiredSignatureError
from pymongo import MongoClient, DESCENDING
from flask_cors import CORS
from jwt.exceptions import ExpiredSignatureError
import time
import jwt,uuid
import json
import re

# Internal imports
import connect
from constants import Keys

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": ["https://geobook-social-b4388792f0c1.herokuapp.com", "https://www.geobook-social.dev","http://localhost:3000"]}})

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

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

app.json_encoder = CustomJSONEncoder

def createJwtToken(username, secret):
    users = connect.access_user_collection()
    user = users.find_one({'username': username})

    if user:
        new_token = jwt.encode({'id': str(user.get('_id')),'username': username,'first': user.get('first_name'),
                                'last': user.get('last_name'),'email': user.get('email'),'exp': datetime.utcnow() + timedelta(minutes=30)},
                                key=secret,algorithm='HS256')
        return new_token

@app.route('/', methods=['POST'])
def checkJWT():
    jwt_token = request.json.get("token")
    decoded_token = None

    if jwt_token == None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404
    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404
    else:
        return jsonify({"Message":"Valid JWT"}), 200

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
                    new_token = jwt.encode({'id': str(user.get('_id')),'username': username,'first': user.get('first_name'),
                        'last': user.get('last_name'),'email': user.get('email'),'exp': datetime.utcnow() + timedelta(minutes=30)},
                        key=secret,algorithm='HS256')

                    return jsonify({'token': token}),200
                else:
                    return jsonify({'message':'Email Not Verified!'}), 401
            else:
                return jsonify({'message': 'Invalid password'}), 401
        else:
            return jsonify({'message': 'User not found'}), 401
    else:
        return jsonify({'message': 'Username and Password are required'}), 401

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

    # Password regex check
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
    if not re.match(password_regex, password):
        return jsonify({'message': 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character (@ $ ! % * # ? &).'}), 404

    # Otherwise, create a new instance of a user
    else:

        # Generate verification token
        token = uuid.uuid4().hex[:8]

        # Create a verification link using the token
        verification_link = f"https://www.geobook-social.dev/verify?token={token}"

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
            'verify_token': token,
            'visited_countries':[]
        }

        # Insert the user
        users.insert_one(new_user)

        return jsonify({'message': 'You were successfully registered! Check your email for the email verification.'}), 200

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
        
    users = connect.access_user_collection()

    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 401

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 401

    # Generate a random token and store it in the user document
    token = uuid.uuid4().hex[:8]
    users.update_one({"_id": user["_id"]}, {"$set": {"reset_token": token}})

    # Send the password reset instructions to the user's email
    pwd_reset_link = f'https://www.geobook-social.dev/reset-password?token={token}'

    msg = Message("Password Reset Email", recipients=[email])
    msg.body = f"You have requested a password reset. Please go to the following link to finalize this process {pwd_reset_link}"
    mail.send(msg)

    return jsonify({"message": "Password reset instructions sent to your email"}),200
    
@app.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    users = connect.access_user_collection()
    new_password = request.json.get("password")

    if not token or not new_password:
        return jsonify({"error": "New password is required"}), 401

    # Password regex check
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
    if not re.match(password_regex, new_password):
        return jsonify({'error': 'Password must be at least 8 characters long and contain at least one letter, one digit, and one special character (@ $ ! % * # ? &).'}), 404

    user = users.find_one({"reset_token": token})

    if not user:
        return jsonify({"error": "Invalid token"}), 401

    # Hash the new password before storing it
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Update the user's password and remove the reset token
    users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
    )

    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    # Verify the token
    users = connect.access_user_collection()

    user = users.find_one({'verify_token': token})

    if not user:
        return jsonify({"error": "Invalid email being verified"}), 401
    
    users.update_one(
        {"email": user["email"]},
        {"$set": {"verified": True}, "$unset": {"verify_token": ""}}
    )
    
    return jsonify({'message': 'Email verified successfully.'}),200

@app.route('/new-post', methods=['POST'])
def new_post():
    title = request.json.get("title")
    content = request.json.get("body")
    tag = request.json.get("tag")

    eastern_tz = timezone(timedelta(hours=-4))
    posted = datetime.now().astimezone(eastern_tz).strftime("%m-%d-%Y %I:%M:%S %p")

    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    author = decoded_token.get('username')  # Use .get() method to handle None value
    newJWT = createJwtToken(author, app.config['SECRET_KEY'])

    posts = connect.access_post_collection()

    new_post = {'author': author, 'title': title, 'content': content, 'tag': tag, 'posted': posted, 'comments': []}

    posts.insert_one(new_post)

    post = posts.find_one({'content': content})

    return jsonify({'message': "Post Added.", 'token': newJWT}), 200

@app.route('/edit-post', methods=['POST'])
def edit_post():
    post_id = request.json.get('id')
    new_title = request.json.get('title')
    new_body = request.json.get("body")
    new_tag = request.json.get("tag")

    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    author = decoded_token.get('username')  # Use .get() method to handle None value
    newJWT = createJwtToken(author, app.config['SECRET_KEY'])

    posts = connect.access_post_collection()
    post = posts.find_one({'_id':ObjectId(post_id)})
    
    posts.update_one({'_id':ObjectId(post_id)}, {'$set':{'title':new_title,'content':new_body, 'tag':new_tag}})

    return jsonify({'message':"Edit Successful","token":newJWT}),200

@app.route('/new-comment',methods = ['POST'])
def new_comment():
    
    id = request.json.get("id")
    content = request.json.get("body") 
    eastern_tz = timezone(timedelta(hours=-4))
    posted = datetime.now().astimezone(eastern_tz).strftime("%m-%d-%Y %I:%M:%S %p")
    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    author = decoded_token.get('username')  # Use .get() method to handle None value
    newJWT = createJwtToken(author, app.config['SECRET_KEY'])

    posts = connect.access_post_collection()

    post = posts.find_one({"_id":ObjectId(id)})

    comment = {'id':ObjectId(id), 'author':author, "content":content, 'posted':posted }
    post["comments"].append(comment)

    posts.update_one({'_id': ObjectId(id)}, {'$set': {'comments': post['comments']}})

    return jsonify({"message":"Comment Added.","token":newJWT}),200

@app.route('/add-country', methods = ['POST'])
def add_country():
    new_country = request.json.get("country")
    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    username = decoded_token.get('username')  # Use .get() method to handle None value
    newJWT = createJwtToken(username, app.config['SECRET_KEY'])

    users = connect.access_user_collection()
    user = users.find_one({"username": username})
    
    user['visited_countries'].append(new_country)
    users.update_one({'username':username}, {'$set':{'visited_countries' : user['visited_countries']}})

    return jsonify({"token": newJWT, "countries": user['visited_countries']})

@app.route('/search', methods=['POST'])
def search_posts():
    data = request.get_json()
    query = data.get('tag')
    page = int(data.get('page', 1))
    per_page = int(data.get('per_page', 10))
    
    posts = connect.access_post_collection()

    regex_pattern = re.compile(f'.*{re.escape(query)}.*', re.IGNORECASE)
    query_filter = {'tag': regex_pattern}
    results = posts.find(query_filter).sort("posted",DESCENDING)
    total_results = posts.count_documents(query_filter)

    start_index = (page - 1) * per_page
    end_index = min(start_index + per_page, total_results)
    current_page_results = results[start_index:end_index]

    time.sleep(1)

    response = {
        'query': query,
        'total_results': total_results,
        'page': page,
        'per_page': per_page,
        'results': list(current_page_results)
    }

    # Convert the response to JSON using the custom JSONEncoder
    json_response = json.dumps(response, cls=CustomJSONEncoder)

    return json_response, 200, {'Content-Type': 'application/json'}

@app.route('/find-post', methods=['POST'])
def find_post():

    id = request.json.get('id')
    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    newJWT = createJwtToken(decoded_token.get('username'), app.config['SECRET_KEY'])

    posts = connect.access_post_collection()

    post = posts.find_one({"_id": ObjectId(id)})

    # Sort the comments by the "posted" field in descending order
    comments = post['comments']
    sorted_comments = sorted(comments, key=lambda x: datetime.strptime(x['posted'], "%m-%d-%Y %I:%M:%S %p"), reverse=True)
    post['comments'] = sorted_comments

    # Convert the ObjectId to string representation
    post['_id'] = str(post['_id'])
    response = {
        'post' : post,
        'token': newJWT
    }

    json_response = json.dumps(response,cls = CustomJSONEncoder)

    return json_response, 200, {'Content-Type': 'application/json'}
    
@app.route('/search-user-posts', methods=['POST'])
def search_user_posts():
    data = request.get_json()
    query = data.get('username')
    page = int(data.get('page', 1))
    per_page = int(data.get('per_page', 10))

    jwt_token = request.json.get("token")
    decoded_token = None

    try:
        decoded_token = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.exceptions.ExpiredSignatureError:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    if decoded_token is None:
        return jsonify({"Error": "Invalid JWT token. Please log in again"}), 404

    newJWT = createJwtToken(query, app.config['SECRET_KEY'])
    
    posts = connect.access_post_collection()

    results = posts.find({'author': query})
    total_results = posts.count_documents({'author': query})

    start_index = (page - 1) * per_page
    end_index = min(start_index + per_page, total_results)
    current_page_results = results[start_index:end_index]

    time.sleep(1)

    response = {
        'query': query,
        'total_results': total_results,
        'page': page,
        'per_page': per_page,
        'token': newJWT,
        'results': list(current_page_results)
    }

    # Convert the response to JSON using the custom JSONEncoder
    json_response = json.dumps(response, cls=CustomJSONEncoder)

    return json_response, 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run()
