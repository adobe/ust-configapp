import sys, copy, json, os, six
from flask import Flask, url_for, jsonify, request, make_response
from ruamel.yaml import YAML

yaml = YAML()
yaml.preserve_quotes = True
yaml.boolean_representation = ['False', 'True']
filename = "c:\\user_sync\\user-sync-config.yml"

def do_test(configfile):
    d = {}
    if os.path.isfile(configfile):
        try:
            configdir = os.path.dirname(configfile)
            d = loadyml(configfile)
            a = d['adobe_users']['connectors']['umapi'] 
            b = 'connector-umapi.yml'

            t1 = a == b
            t2 = isinstance(a, six.string_types)
            t3 = isinstance(b, six.string_types)

            print(a)
        except Exception as e:
            print(str(e))
    pass

def loadyml(configfile):
    d = {}
    try:
        d = yaml.load(open(configfile))
    except:
        print ("Failed to read config " + configfile)
    return d

if __name__ == '__main__':
  do_test(filename)
