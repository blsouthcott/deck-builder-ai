# deck-builder-ai

## Flask backend configuration
You'll need to create a .flaskenv file and add the following environment variables to it:
- OPENAI_API_KEY (generate this through your OpenAI developer account)
- ALLOWED_HOSTS (should be http://localhost:{whatever port you're running the UI on})
- SECRET_KEY (we're not using this in development so can be empty)
- FLASK_RUN_PORT (whatever port you want the backend running on for local development)
- FLASK_APP=app.py
- FLASK_ENV=development
- FLASK_DEBUG=1

This may be different depending on what virtual environment tool you're using, but generally to start up the backend run `flask run`

If you're using pyenv to manage your virtual environments you can run `pyenv exec flask run`


## UI development
From the top level directory run
```
cd ui
npm install
npm install sass -g
npm run build-css
npm start
```
