# Awake Labs Coding Challenge

These steps assume you're using Linux, but they should be similar on Windows; the commands might just be slightly different.

## Installation

1. Clone this repository and enter it. If using WSL, make sure to put the repo somewhere on the Linux drive, not Windows, or the Docker script won't work properly.
2. Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.
3. Make sure you have [Node >= 14.0.0 and npm >= 5.6](https://nodejs.org/en/) installed.
4. Install the Python dependencies:
```sh
python3 -m venv flask-api/venv # optional
. flask-api/venv/bin/activate # optional
pip3 install -r flask-api/requirements.txt
```
5. Install the Node dependencies: `cd react-frontend && npm install`

## Running

Start each terminal in the repository folder.

1. Make sure Docker is running: `sudo service docker start`
2. Start the database: `sudo docker-compose up`
3. In a new terminal, start the backend: `cd flask-api && . venv/bin/activate && flask run` (skip the venv part if you didn't set up a venv earlier)
4. In a new terminal, start the frontend: `cd react-frontend && npm start`
5. The frontend should open in your browser, but if it doesn't, go to http://localhost:3000.