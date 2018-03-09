import json, sys, os, six
from flask import Flask, url_for, jsonify, request, make_response
from flask_cors import CORS
from ruamel.yaml import YAML

app = Flask(__name__)
app.url_map.strict_slashes = False
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ['GET', 'POST', 'OPTIONS']}})

yaml = YAML()
yaml.preserve_quotes = True
yaml.boolean_representation = ['False', 'True']

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/api/v1/')
def api_root():
    return 'Welcome'

@app.route('/api/v1/config/', methods=['POST'])
def do_save_config():
    errMsg = None
    configfile = request.args.get('configfile')
    connector = request.args.get('connector')    
    js = request.get_json()
    
    try:
        bRes = False
        if os.path.isfile(configfile):
            if connector == "umapi":
                cfile = js['ustapp']['umapifile']
                bRes = saveyml(cfile, js['adobe_users']['connectors']['umapi_data'])
            elif connector == "ldap":
                cfile = js['ustapp']['ldapfile']
                bRes = saveyml(cfile, js['directory_users']['connectors']['ldap_data'])
            elif connector == "ust":
                cfile = configfile
                bRes = saveyml(cfile, js)
        if(not bRes):
            errMsg = "ERR1.1: Failed to process" + " - " + connector
    except Exception as e:
        errMsg = "ERR1:Failed to save" + " - " + str(e)
        print (errMsg)

    return jsonify({"Result": True, "ErrorMessage": errMsg})
    
@app.route('/api/v1/config/', methods=['GET'])
def do_load_config():
    configfile = request.args.get('configfile')
    d = {}
    errMsg = None
    try:
        if os.path.isfile(configfile):
            configdir = os.path.dirname(configfile)
            d = loadyml(configfile)

            umapidict = {}
            ldapdict = {}

            umapipath = ""
            ldappath = ""

            try:
                umapipathkey = d['adobe_users']['connectors']['umapi']
                ldappathkey = d['directory_users']['connectors']['ldap']                 
            except KeyError:
                raise ValueError("No valid connector found.")

            if not isinstance(umapipathkey, six.string_types):
                umapipathkey = umapipathkey[0]

            umapipath = os.path.join(configdir, umapipathkey)
            ldappath = os.path.join(configdir, ldappathkey)
            
            umapidict = loadyml(umapipath)
            ldapdict = loadyml(ldappath)               
            
            d['adobe_users']['connectors']['umapi_data'] = umapidict
            d['directory_users']['connectors']['ldap_data'] = ldapdict

            d['ustapp'] = {}
            d['ustapp']['basedir'] = configdir
            d['ustapp']['basefile'] = configfile
            d['ustapp']['umapifile'] = umapipath
            d['ustapp']['ldapfile'] = ldappath
    except Exception as e:
        d = {}
        errMsg = "ERR2:Failed to load" + " - " + str(e)
        print (errMsg)
                    
    return jsonify({"Result": d, "ErrorMessage": errMsg})

def loadyml(configfile):
    d = {}
    try:
        d = yaml.load(open(configfile))
    except:
        print ("Failed to read config " + configfile)
    return d

def saveyml(configfile, js):
    isok = False
    try:
        d = loadyml(configfile)
        for k in js:
            if k in d:
              if type(js[k]) in [str, bool, int]:
                d[k] = js[k]
              elif type(js[k]) in [dict, list]:
                for l in js[k]:
                    if l != 'connectors':
                      if d[k][l] != js[k][l]:
                        d[k][l] = js[k][l]
                    
        with open(configfile, 'w') as f:
            yaml.dump(d, f)
        isok = True
    except Exception as e:
            print ("Failed to save config " + configfile + " -err " + str(e))
    return isok

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=14242, threaded=True)