from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection setup
client = MongoClient("mongodb+srv://chandrika:chandrika  @cluster0.hfyz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  # Replace with your MongoDB URI if needed
db = client['weather_database']  # Using a database named 'weather_database'
weather_collection = db['weather_data']  # Using a collection named 'weather_data'

@app.route('/')
def index():
    return render_template('index.html')

# Route to store weather data in MongoDB
@app.route('/store_weather', methods=['POST'])
def store_weather():
    data = request.json
    location = data.get('location')
    days_weather = data.get('days_weather')

    # Prepare the document to be stored in MongoDB
    weather_document = {
        "location": location,
        "days": days_weather
    }
    
    # Insert the document into the MongoDB collection
    weather_collection.insert_one(weather_document)

    return jsonify({"message": "Weather data stored successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
