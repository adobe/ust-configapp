import json, sys, os
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
    configfile = request.args.get('configfile')
    connector = request.args.get('connector')
    
    js = request.get_json()
    if os.path.isfile(configfile):
        try:
            if connector == "umapi":
                cfile = js['ustapp']['umapifile']
                saveyml(cfile, js['adobe_users']['connectors']['umapi_data'])
            elif connector == "ldap":
                cfile = js['ustapp']['ldapfile']
                saveyml(cfile, js['directory_users']['connectors']['ldap_data'])
            elif connector == "ust":
                cfile = configfile
                saveyml(cfile, js)
        except Exception as e:
            print ("POST: Failed to process: "+ str(e)) 
    return jsonify({"Result": True, "Message": None})
    
@app.route('/api/v1/config/', methods=['GET'])
def do_load_config():
    configfile = request.args.get('configfile')
    d = {}
    if os.path.isfile(configfile):
        try:
            configdir = os.path.dirname(configfile)

            d = loadyml(configfile)

            umapidict = {}
            ldapdict = {}

            umapipath = ""
            ldappath = ""

            try:
                umapipath = d['adobe_users']['connectors']['umapi']
                ldappath = d['directory_users']['connectors']['ldap']

                umapidict = loadyml(configdir + "\\" + umapipath)
                ldapdict = loadyml(configdir + "\\" + ldappath)               
            except KeyError:
                pass
            
            d['adobe_users']['connectors']['umapi_data'] = umapidict
            d['directory_users']['connectors']['ldap_data'] = ldapdict

            d['ustapp'] = {}
            d['ustapp']['basedir'] = configdir
            d['ustapp']['basefile'] = configfile
            d['ustapp']['umapifile'] = configdir + "\\" + umapipath
            d['ustapp']['ldapfile'] = configdir + "\\" + ldappath
        except Exception as e:
            print ("GET: Failed to process: "+ str(e))
                    
    return jsonify({"Result": d, "Message": "Loaded " + configfile})

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