# Adobe User Sync Tool Configuration Wizard
This is User Sync tool configuration wizard. It helps configure the User Sync tool with User Management API (Adobe.io), Enterprise Directory (LDAP) and sync settings.

The User Sync Tool is a command-line tool that sync users and group information from an organization's Enterprise directory system to the Adobe Admin Console. The key goals of the User Sync Tool are to streamline the process of named user deployment and automate user management for all Enterprise customers.

Overview:
https://spark.adobe.com/page/E3hSsLq3G1iVz/<br/>
User Sync Tool:
https://github.com/adobe-apiplatform/user-sync.py

<hr/>

<p>
<img src="https://user-images.githubusercontent.com/28625684/43533696-52235634-95ad-11e8-9c23-07bf2ee5a3dd.png" style="display:block-inline" height="215">
<img src="https://user-images.githubusercontent.com/28625684/43534169-9d402d80-95ae-11e8-894c-d45111ceacc5.png" style="display:block-inline" height="215">
<img src="https://user-images.githubusercontent.com/28625684/43534034-42f443f2-95ae-11e8-9a0b-0a85753d0a30.png" style="display:block-inline" height="215">
</p>

## Supported Features

The wizard supports: 
- Configuration of Adobe User Management API (UMAPI) token
- Configuration of Enterprise Directory information (including username format login settings)
- Configuration new user identity, group mappings and logging information
- Dropdown selection for Enterprise Directory specific group filter (AD/OpenLDAP)
- Exclude adobe-side identity types/groups from sync 
- Enable reading nested group information 
- Enable secure password storage for ldap password

You can still add additional keys/edit current key values manually in the configuration files.
Please note, any yml comments and keys order will not be saved during round-trip save 

## Installation

Setup developement enviornment:

```
npm install --global yarn

yarn install
```
Run in developement-mode:

```
yarn start
```
Build application for production:

```
yarn dist
.\dist\ustapp 0.1.0.exe
```

## Dev Notes

Developement require [NodeJS](https://nodejs.org/en/). Current release is test and working for Windows. Other operating systems support will be added soon.
