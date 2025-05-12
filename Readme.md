# Email Formalizer Chatbot

A Flask-based chatbot that transforms informal messages into formal language using the Hugging Face Router API. This tool is ideal for drafting professional emails or improving communication tone.

---

## Features

- **Text Formalization**: Converts informal text into a formal tone.
- **Hugging Face Integration**: Utilizes the `deepseek/deepseek-prover-v2-671b` model.
- **Retry Logic**: Handles API rate limits and failures with up to 3 retries.
- **Fallback Mechanism**: Provides basic string-based adjustments if the API fails.
- **Web Interface**: Simple and user-friendly HTML form for input.

---

## Requirements

Ensure you have Python installed. Install the required dependencies using pip:

```bash
pip install flask requests python-dotenv
```

---

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/email-formalizer-chatbot.git
   cd email-formalizer-chatbot
   ```

2. **Configure Environment Variables**:

   Create a `.env` file in the project root and add your Hugging Face API key:

   ```env
   HF_API_TOKEN=your_huggingface_token_here
   ```

3. **Run the Application**:

   Start the Flask server:

   ```bash
   python app.py
   ```

   The app will be accessible at `http://127.0.0.1:5000`.

---

## File Structure

```
email-formalizer-chatbot/
├── app.py                # Main Flask server logic
├── templates/
│   └── index.html        # Web frontend (user input form)
├── static/               # Static assets
│   ├── app.js
│   └── style.css
├── .env                  # Environment variables
└── README.md             # Documentation
```

---

## API Endpoint

### POST `/predict`

Send a JSON object with the message to be formalized.

**Request Example**:

```json
{
  "message": "thank you"
}
```

**Response Example**:

```json
{
  "answer": "I express my gratitude."
}
```

---

## Fallback Handling

If the Hugging Face API fails or returns an error:

- The system attempts a minimal string-based formalization (e.g., replacing "hey" with "Hello").
- A fallback message is returned along with the adjusted content.

---

## Notes

- The model used is `deepseek/deepseek-prover-v2-671b`, accessed via Hugging Face's Router API.
- The app supports up to 3 retries for rate-limited or timed-out requests.
- Basic text cleanup is applied if the API response contains markdown or quotes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
