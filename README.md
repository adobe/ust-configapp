# ust-configapp
This is User Sync tool configuration wizard. It helps configure the User Sync tool for User Management API (Adobe.io), Enterprise Directory (LDAP) and sync settings.

## Installation

Setup developement enviornment:

```
yarn install
pip install -r pyapi\requirements.txt
```
Run in developement-mode:

```
yarn start
python pyapi\app.py
```
Build application for production:

```
yarn dist
.\dist\ustapp 0.1.0.exe
```

## Note

Developement require [NodeJS](https://nodejs.org/en/) and [Python](https://www.python.org/). 
Production require only [Python](https://www.python.org/). 
