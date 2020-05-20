/*
ADOBE CONFIDENTIAL

Copyright 2017 Adobe

All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

import Globals from './Globals';
const yaml = window.require('js-yaml');
const fs = window.require('fs');
const path = window.require('path');

export default class {
    readYMLFile(configFile) {
        // Get document, or throw exception on error
        return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    }

    writeYMLFile(configFile, d, callback) {
        const basedir = path.dirname(configFile);
        const bakfile = path.join(basedir, "_" + path.win32.basename(configFile) + ".bak");
        if (!fs.existsSync(bakfile)) {
            fs.copyFileSync(configFile, bakfile);
        }

        const ymldata = yaml.dump(d, { lineWidth: -1, noCompatMode: true });
        fs.writeFile(configFile, ymldata, 'utf8', (err) => {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
            if (callback) {
                callback();
            }
        });
    }

    loadConfigFile(configFile, callback) {
        try {
            const basedir = path.dirname(configFile);
            const d = this.readYMLFile(configFile);

            const umapidoc = this.readYMLFile(path.join(basedir, d["adobe_users"]["connectors"]["umapi"]));
            const ldapdoc = this.readYMLFile(path.join(basedir, d["directory_users"]["connectors"]["ldap"]));

            // process and clear default text 
            const ent_umapi = umapidoc["enterprise"];
            Object.keys(ent_umapi).forEach(k => {
                if (k in Globals.DefaultStrings_enterprise_umapi && ent_umapi[k] === Globals.DefaultStrings_enterprise_umapi[k]) {
                    ent_umapi[k] = "";
                }
            });

            Object.keys(ldapdoc).forEach(k => {
                if (k in Globals.DefaultStrings_ldap && ldapdoc[k] === Globals.DefaultStrings_ldap[k]) {
                    ldapdoc[k] = "";
                }
            });

            if (ldapdoc.hasOwnProperty("secure_password_key")) {
                ldapdoc["secure_password_key_enabled"] = true;
            }

            if (ldapdoc.hasOwnProperty("user_username_format")) {
                ldapdoc["user_username_format_enabled"] = true;
            }

            d["adobe_users"]["connectors"]["umapi_data"] = umapidoc;
            d["directory_users"]["connectors"]["ldap_data"] = ldapdoc;

            // process empty adobe user group mappings (replace None for empty item mapping) to help round-trip save
            let groups = d['directory_users']['groups'];
            if (!groups) {
                groups = [];
            }
            groups.forEach(e => {
                if (!e["adobe_groups"]) {
                    e["adobe_groups"] = [""];
                }
            });
            d['directory_users']['groups'] = groups;
            // Initializes additional_groups in yaml file since on install it does not exist
            let additional_groups = d['directory_users']['additional_groups']
            if (!additional_groups) {
                d['directory_users']['additional_groups'] = [];
            }

            if(callback){
                callback(d, false);
            }
        } catch (e) {
            console.log(e);
            
            if(callback){
                callback(null, true);
            }            
        }
    }

    saveConfigFile(configFile, ds, connector, callback) {
        let ok = false;
        try {
            const basedir = path.dirname(configFile);
            // create deep copy of object for save
            let d = JSON.parse(JSON.stringify(ds));

            switch (connector) {
                case 'umapi':
                    this.writeYMLFile(
                        path.join(basedir, d["adobe_users"]["connectors"]["umapi"]),
                        d["adobe_users"]["connectors"]["umapi_data"],
                        callback);
                    ok = true;
                    break;
                case 'ldap':
                    const ldapobj = d["directory_users"]["connectors"]["ldap_data"];
                    if (ldapobj.hasOwnProperty("secure_password_key_enabled")) {
                        delete ldapobj["secure_password_key_enabled"];
                    }

                    if (ldapobj.hasOwnProperty("user_username_format_enabled")) {
                        delete ldapobj["user_username_format_enabled"];
                        if (ldapobj.hasOwnProperty("user_username_format") && !ldapobj["user_username_format"]) {
                            delete ldapobj["user_username_format"];
                        }
                        if (ldapobj.hasOwnProperty("user_domain_format") && !ldapobj["user_domain_format"]) {
                            delete ldapobj["user_domain_format"];
                        }
                    }

                    this.writeYMLFile(
                        path.join(basedir, d["directory_users"]["connectors"]["ldap"]),
                        ldapobj,
                        callback);
                    ok = true;
                    break;
                case 'ust':
                    delete d["adobe_users"]["connectors"]["umapi_data"];
                    delete d["directory_users"]["connectors"]["ldap_data"];

                    // process empty adobe user group mappings (replace empty item for None mapping) to help round-trip save
                    const groups = d['directory_users']['groups'];
                    groups.forEach(e => {
                        if (e["adobe_groups"].every(k => !k)) {
                            e["adobe_groups"] = null;
                        }
                    });
                    d['directory_users']['groups'] = groups.length > 0 ? groups : null;

                    if(!d['directory_users']['default_country_code']){
                        d['directory_users']['default_country_code'] = null;
                    }

                    this.writeYMLFile(configFile, d, callback);
                    ok = true;
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
}