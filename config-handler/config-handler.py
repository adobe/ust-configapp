import argparse
import sys
import json
import os
import six
from ruamel.yaml import YAML


def get_yaml_parser():
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.boolean_representation = ['False', 'True']
    return yaml


def open_config_file(filename):
    if not filename:
        raise Exception('Config file path must be specified')

    if not os.path.isfile(filename):
        raise Exception('Config file not found: {}'.format(filename))

    return open(filename, 'r')


def load_config(**kwargs):
    config_file = kwargs['config_file']

    configdir = os.path.dirname(config_file)
    yaml = get_yaml_parser()
    d = yaml.load(open_config_file(config_file))

    try:
        umapipathkey = d['adobe_users']['connectors']['umapi']
        ldappathkey = d['directory_users']['connectors']['ldap']

        if not isinstance(umapipathkey, six.string_types):
            umapipathkey = umapipathkey[0]
    except KeyError:
        raise ValueError("No valid connector found.")

    umapipath = os.path.join(configdir, umapipathkey)
    ldappath = os.path.join(configdir, ldappathkey)

    umapidict = yaml.load(open_config_file(umapipath))
    ldapdict = yaml.load(open_config_file(ldappath))

    d['adobe_users']['connectors']['umapi_data'] = umapidict
    d['directory_users']['connectors']['ldap_data'] = ldapdict

    d['ustapp'] = {}
    d['ustapp']['basedir'] = configdir
    d['ustapp']['basefile'] = config_file
    d['ustapp']['umapifile'] = umapipath
    d['ustapp']['ldapfile'] = ldappath

    return d


def saveyml(d, js):
    for k in js:
        if k in d:
            if type(js[k]) in [str, bool, int]:
                d[k] = js[k]
            elif type(js[k]) in [dict, list]:
                for l in js[k]:
                    if l != 'connectors':
                        if d[k][l] != js[k][l]:
                            d[k][l] = js[k][l]
    return d


def save_config(**kwargs):
    config_file = kwargs['config_file']
    connector = kwargs['connector']
    input_data = kwargs['input']

    yaml = get_yaml_parser()
    
    saved_data = {}
    if os.path.isfile(config_file):
        if connector == "umapi":
            yaml_data = yaml.load(open_config_file(input_data['ustapp']['umapifile']))
            saved_data = saveyml(yaml_data, input_data['adobe_users']['connectors']['umapi_data'])
            yaml.dump(yaml_data, open(input_data['ustapp']['umapifile'], 'w'))
        elif connector == "ldap":
            yaml_data = yaml.load(open_config_file(input_data['ustapp']['ldapfile']))
            saved_data = saveyml(yaml_data, input_data['directory_users']['connectors']['ldap_data'])
            yaml.dump(yaml_data, open(input_data['ustapp']['ldapfile'], 'w'))
        elif connector == "ust":
            yaml_data = yaml.load(open_config_file(config_file))
            saved_data = saveyml(yaml_data, input_data)
            yaml.dump(yaml_data, open(config_file, 'w'))

    return saved_data


def main(args):
    funcs = {
        'load': load_config,
        'save': save_config,
    }

    if args.func not in funcs:
        sys.stderr.write("Error: func must be 'load' or 'save'\n")
        sys.exit(1)

    func_args = {'config_file': args.config_filename, 'connector': args.connector_type}
    try:
        input_data = json.load(sys.stdin)
        if input_data:
            func_args['input'] = input_data
        output = funcs[args.func](**func_args)
        json.dump(output, sys.stdout)
    except Exception as e:
        sys.stderr.write("Error: {}".format(e))
        sys.exit(1)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Config handler for UST Config App')
    parser.add_argument('func', type=str, help='function to execute (save/load config)',
                        metavar='load|save')
    parser.add_argument('-c', '--config',
                        help='filename of config file (required to load config)',
                        metavar='filename', dest='config_filename')
    parser.add_argument('-o', '--connector',
                        help='connector type (used in config update)',
                        metavar='filename', dest='connector_type')

    args = parser.parse_args()
    main(args)
