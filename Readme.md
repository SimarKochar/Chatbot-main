
# Email Formalizer Chatbot

A Flask-based chatbot that converts informal messages into formal language using the Hugging Face Router API. Designed for use in email drafting or professional communication contexts.

## Features

- Converts informal text into formal tone.
- Utilizes Hugging Face `deepseek/deepseek-prover-v2-671b` model.
- Retry logic for API rate limiting or failures.
- Basic local fallback if API fails.
- Web interface with a simple HTML form.

## Requirements

Install dependencies using pip:

```bash
pip install flask requests python-dotenv
````

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/email-formalizer-chatbot.git
cd email-formalizer-chatbot
```

2. Create a `.env` file in the project root and add your Hugging Face API key:

```env
HF_API_TOKEN=your_huggingface_token_here
```

3. Run the Flask application:

```bash
python app.py
```

The app will be available at `http://localhost:5000`.

## File Structure

```
email-formalizer-chatbot/
├── app.py                # Main Flask server logic
├── templates/
│   └── index.html        # Web frontend (user input form)
├── static/               # static assets
|   └── app.js
|   └── style.css          
├── .env                  # Environment variables
└── README.md             # Documentation
```

## API Endpoint

### POST `/predict`

Send a JSON object with the message to be formalized.

**Request:**

```json
{
  "message": "hey, just checking if u got my last email"
}
```

**Response:**

```json
{
  "answer": "Hello, I am inquiring if you have received my previous email."
}
```

## Fallback Handling

If the Hugging Face API fails or returns an error:

* The system attempts a minimal string-based formalization (e.g., replacing "hey" with "Hello").
* A fallback message is returned along with the adjusted content.

## Notes

* The model used is `deepseek/deepseek-prover-v2-671b` accessed via Hugging Face's Router API.
* The app supports up to 3 retries for rate-limited or timed-out requests.
* Basic text cleanup is applied if the API response is wrapped in markdown or quotes.

## License

This project is licensed under the MIT License.
