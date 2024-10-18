Weather Dashboard with MongoDB Integration

Prerequisites

Make sure you have the following installed on your machine:

- Python 3.8+
- MongoDB (running locally or a cloud instance)
- Node.js (optional for front-end development)

Setup Instructions
1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install Python Dependencies

Install the required Python packages using pip. The dependencies are listed in requirements.txt:

```bash
pip install -r requirements.txt
```

requirements.txt includes:
```
Flask==2.0.1
pymongo==3.12.1
```

3. Set Up MongoDB

Make sure MongoDB is running locally or using a cloud MongoDB instance (e.g., MongoDB Atlas).

By default, the project uses the following MongoDB URI in app.py:

```python
client = MongoClient("mongodb://localhost:27017/")
```

You can modify this if your MongoDB instance is different.

4. Run the Flask Application

To start the Flask application, run the following command from the project directory:

```bash
python app.py
```

The app will run locally on `http://127.0.0.1:5000/` by default.

5. Open the Application

Open your browser and go to:

```
http://127.0.0.1:5000/
```

This will load the weather dashboard where you can search for cities or use your current location to fetch weather data.

6. Using the Weather Dashboard

- **Search by City**: Enter a city name and click the "Search" button.
- **Use Location**: Click the "Use My Location" button to automatically get weather data based on your current coordinates.
- **Stored Data**: Each request stores the weather data in the MongoDB database with location and weather details for the upcoming days.

7. MongoDB Data Structure

The weather data for each city is stored in the `weather_data` collection inside the `weather_database` in the following structure:

```json
{
  "location": "City Name",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "temperature": "Number",
      "wind": "Number",
      "humidity": "Number",
      "description": "String",
      "icon": "String"
    },
    ...
  ]
}
```

Frontend (HTML/CSS/JS)

- **Frontend HTML**: Located in `templates/index.html`.
- **JavaScript**: Handles the API calls to OpenWeatherMap and sends the weather data to the Flask backend (`/static/script.js`).
- **CSS**: Located in `static/style.css` for styling the frontend.

API Usage

- **OpenWeatherMap API**: You'll need your own OpenWeatherMap API key. Replace the placeholder `API_KEY` in `script.js` with your actual API key.

```javascript
const API_KEY = "your_openweathermap_api_key";
```

Example Workflow

1. Search for a city or click "Use My Location."
2. The weather data is fetched and displayed.
3. The weather data is stored in MongoDB for that city.

License

This project is licensed under the MIT License - see the LICENSE file for details.

