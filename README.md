# ust-configapp
This is User Sync tool configuration wizard. It helps configure the User Sync tool with User Management API (Adobe.io), Enterprise Directory (LDAP) and sync settings.

## Installation

Setup developement enviornment:

```
npm install --global yarn

yarn install
pip install -r pyapi\requirements.txt
```

Before running the app in development mode or building it for distribution, the `config-handler` app must be built. See the 
[config-handler documentation](config-handler/README.md) for build instructions.

Run in developement-mode:

```
yarn start
```
Build application for production:

```
yarn dist
.\dist\ustapp 0.1.0.exe
```

## Note

Developement require [NodeJS](https://nodejs.org/en/).  [Python](https://www.python.org/) is required to build the `config-handler` component.
