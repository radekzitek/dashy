# Dashy

Personal Command Center / Dashboard

## Python

```
python3 -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install django djangorestframework psycopg2-binary python-decouple
pip freeze > requirements.txt
django-admin startproject backend .

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Node.js

```
node --version
v23.7.0
nvm use default
Now using node v22.14.0 (npm v10.9.2)

npm install -g @quasar/cli
npm install
quasar dev
```
