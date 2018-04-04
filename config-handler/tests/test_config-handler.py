import os
import shutil
import json
import pytest
from subprocess import Popen, PIPE


@pytest.fixture
def fixture_dir():
    return os.path.abspath(
           os.path.join(
           os.path.dirname(__file__), 'fixture'))


@pytest.fixture
def config_files(tmpdir, fixture_dir):
    ust_file = 'user-sync-config.yml'
    ldap_file = 'connector-ldap.yml'
    umapi_file = 'connector-umapi.yml'
    test_files = {
        'ust': os.path.join(tmpdir, ust_file),
        'ldap': os.path.join(tmpdir, ldap_file),
        'umapi': os.path.join(tmpdir, umapi_file),
    }
    ust_fixture_path = os.path.join(fixture_dir, ust_file)
    shutil.copy(ust_fixture_path, test_files['ust'])
    ldap_fixture_path = os.path.join(fixture_dir, ldap_file)
    shutil.copy(ldap_fixture_path, test_files['ldap'])
    umapi_fixture_path = os.path.join(fixture_dir, umapi_file)
    shutil.copy(umapi_fixture_path, test_files['umapi'])

    return test_files


@pytest.fixture
def config_handler(fixture_dir):
    # TODO - check for OS and return appropriate binary
    return os.path.join(fixture_dir, 'config-handler.exe')


def run_config_handler(config_handler, params, input):
    cmd = [config_handler] + params
    ch = Popen(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    return [out.decode() for out in ch.communicate(input.encode())]


def test_load_config(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'load.json'))
    json_load = json.load(fh)
    output, err = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    json_load_test = json.loads(output)
    # the paths in the "ustapp" key are expected to be different, so delete those keys for the sake
    # of comparison
    del json_load['ustapp']
    del json_load_test['ustapp']
    assert json_load == json_load_test
    assert err == ''


def test_load_no_config(config_handler):
    output, err = run_config_handler(config_handler, ['load'], '{}')
    assert err == 'Error: No config file to load'


def test_save_ust_config(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'save_ust.json'))
    json_save_ust = json.load(fh)
    load_output, _ = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    config_data = json.loads(load_output)
    config_data['directory_users']['user_identity_type'] = 'federatedID'
    save_output, err = run_config_handler(config_handler, ['save', '-c',
                                                           config_files['ust'], '-o', 'ust'], json.dumps(config_data))
    json_save_test = json.loads(save_output)
    assert json_save_ust == json_save_test
    assert err == ''


def test_save_ust_config_add_obj(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'save_ust_add_obj.json'))
    json_save_ust = json.load(fh)
    load_output, _ = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    config_data = json.loads(load_output)
    config_data['adobe_users']['exclude_users'] = ['user1@example.com', 'user2@example.com']
    save_output, err = run_config_handler(config_handler, ['save', '-c',
                                                           config_files['ust'], '-o', 'ust'], json.dumps(config_data))
    json_save_test = json.loads(save_output)
    assert json_save_ust == json_save_test
    assert err == ''


def test_save_ldap_config(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'save_ldap.json'))
    json_save_ldap = json.load(fh)
    load_output, _ = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    config_data = json.loads(load_output)
    config_data['directory_users']['connectors']['ldap_data']['username'] = 'user@example.com'
    save_output, err = run_config_handler(config_handler, ['save', '-c',
                                                           config_files['ldap'], '-o', 'ldap'], json.dumps(config_data))
    json_save_test = json.loads(save_output)
    assert json_save_ldap == json_save_test
    assert err == ''


def test_save_ldap_config_add_obj(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'save_ldap_add_obj.json'))
    json_save_ldap = json.load(fh)
    load_output, _ = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    config_data = json.loads(load_output)
    config_data['directory_users']['connectors']['ldap_data']['secure_password_key'] = "my_pw_key"
    save_output, err = run_config_handler(config_handler, ['save', '-c',
                                                           config_files['ldap'], '-o', 'ldap'], json.dumps(config_data))
    json_save_test = json.loads(save_output)
    assert json_save_ldap == json_save_test
    assert err == ''


def test_save_umapi_config(config_files, fixture_dir, config_handler):
    fh = open(os.path.join(fixture_dir, 'save_umapi.json'))
    json_save_umapi = json.load(fh)
    load_output, _ = run_config_handler(config_handler, ['load', '-c', config_files['ust']], '{}')
    config_data = json.loads(load_output)
    config_data['adobe_users']['connectors']['umapi_data']['enterprise']['priv_key_path'] = 'private.key'
    save_output, err = run_config_handler(config_handler,
                                          ['save', '-c', config_files['umapi'], '-o', 'umapi'],
                                          json.dumps(config_data))
    json_save_test = json.loads(save_output)
    print(json_save_test)
    assert json_save_umapi == json_save_test
    assert err == ''
