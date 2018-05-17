import argparse
import sys
import json
import os
from ruamel.yaml import YAML


def get_yaml_parser():
    """
    Provide a consistent YAML parser to each function that needs one.
    :return:
    """
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.boolean_representation = ['False', 'True']
    return yaml


def open_config_file(filename):
    """
    Open file handler to config file with standardized error handling.
    :param filename:
    :return:
    """
    if not filename:
        raise Exception('Config file path must be specified')

    if not os.path.isfile(filename):
        raise Exception('Config file not found: {}'.format(filename))

    return open(filename, 'r')


def load_config(**kwargs):
    """
    Load a config file.
    Parameters are read from kwargs.  'config_file' must be provided.  Other arguments will be ignored.
    :param kwargs:
    :return:
    """
    if 'config_file' not in kwargs or not kwargs['config_file']:
        raise AttributeError('No config file to load')

    config_file = kwargs['config_file']

    configdir = os.path.dirname(config_file)
    yaml = get_yaml_parser()
    d = yaml.load(open_config_file(config_file))

    try:
        umapipathkey = d['adobe_users']['connectors']['umapi']
        ldappathkey = d['directory_users']['connectors']['ldap']

        if not isinstance(umapipathkey, str):
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


def update_config(d, js):
    """
    Update the contents of a config file.
    :param d: Deserialized YAML data
    :param js: Deserialized JSON data (from stdin)
    :return:
    """
    if isinstance(js, list):
        js_iter = enumerate(js)
    else:
        js_iter = js.items()

    for js_key, js_val in js_iter:
        if js_key == 'ustapp' or js_key == 'connectors':
            continue
        if isinstance(d, list):
            if js_key not in d:
                d[js_key] = js_val
                continue
            yml_val = d[js_key]
        else:
            yml_val = d.get(js_key)
            if not yml_val:
                d[js_key] = js_val
                continue
        if type(js_val) in [str, bool, int, float]:
            d[js_key] = js_val
            continue
        if type(js_val) in [dict, list]:
            d[js_key] = update_config(yml_val, js_val)
    return d


def save_config(**kwargs):
    """
    Save a config file.
    Parameters are provided in kwargs.
        config_file: path to config file
        connector: identifies which config file will be updates (ust, ldap, umapi)
        input_data: deserialized json data from stdin
    All other kwargs keys are ignored.
    :param kwargs:
    :return:
    """
    config_file = kwargs['config_file']
    connector = kwargs['connector']
    input_data = kwargs['input']

    yaml = get_yaml_parser()
    
    saved_data = {}
    if os.path.isfile(config_file):
        if connector == "umapi":
            yaml_data = yaml.load(open_config_file(input_data['ustapp']['umapifile']))
            saved_data = update_config(yaml_data, input_data['adobe_users']['connectors']['umapi_data'])
            yaml.dump(yaml_data, open(input_data['ustapp']['umapifile'], 'w'))
        elif connector == "ldap":
            yaml_data = yaml.load(open_config_file(input_data['ustapp']['ldapfile']))
            saved_data = update_config(yaml_data, input_data['directory_users']['connectors']['ldap_data'])
            yaml.dump(yaml_data, open(input_data['ustapp']['ldapfile'], 'w'))
        elif connector == "ust":
            yaml_data = yaml.load(open_config_file(config_file))
            saved_data = update_config(yaml_data, input_data)
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
                        metavar='ust|umapi|ldap', dest='connector_type')

    args = parser.parse_args()
    main(args)
