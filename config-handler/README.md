# Config Handler for UST Config App

This is a helper process for the [UST Config App](https://github.com/bajwa-adobe/ust-configapp).
It updates the YML configuration files using input provided by the Config App.  The Config App
does not manipulate YAML directly because node.js does not have any YAML libraries that preserve
comments and key order.  Python has [ruamel.yaml](http://yaml.readthedocs.io/en/latest/), which
can do both.

# Building

The config-handler is built with [pyinstaller](https://www.pyinstaller.org/) to build the application
as a standalone executable.  The built executable does not require Python to run.

The build file is `config-handler.spec`.  This file tells pyinstaller how to build the standalone
executable.

## Running the Build Process

To build the config-handler, just run pyinstaller with the spec file:

```
$ cd config-handler
$ pyinstaller config-handler.spec
```

The executable can be found in the `dist/` directory, inside `config-handler`.

# Running

```
usage: config-handler.exe [-h] [-c filename] [-o ust|umapi|ldap] load|save

Config handler for UST Config App

positional arguments:
  load|save             function to execute (save/load config)

optional arguments:
  -h, --help            show this help message and exit
  -c filename, --config filename
                        filename of config file (required to load config)
  -o ust|umapi|ldap, --connector ust|umapi|ldap
                        connector type (used in config update)
```

config-handler runs in two modes - load and save.  "Load" mode loads the main UST config file as well
as the LDAP and UMAPI connector config files, serializes all config data to a single jaon object, and
writes the json data to stdout.

"Save" mode reads json from stdin.  Data provided to the tool in "save" mode must be in the format provided
by "load".  The config file that actually gets saved depends on the "--connector" parameter.

| `--connector` value | config file |
|---|---|
| `ust` | `user-sync-config.yml` |
| `ldap` | `connector-ldap.yml` |
| `umapi` | `connector-umapi.yml` |

In "save" mode, the `--config` parameter must always point to the main configuration file `user-sync-config.yml`.

## Loading Config

```
$ echo '{}' | config_handler.exe load -c \path\to\user-sync-config.yml
{"adobe_users": { ... }}
```

NOTE: Because the config handler always reads json data from stdin, it is necessary to pass an empty json
object to the config-handler in "load" mode to prevent the application from hanging.

## Saving Config

```
$ cat updated_load.json | config-handler.exe save -c \path\to\user-sync-config.yml -o ust
{"adobe_users": { ... }}
```

In "save" mode, the config-handler writes a json-encoded version of the data being saved to stdout.  It varies
depending on the `--connector` value specified.

# Testing

config-handler's tests require a built executable to run.  Before running the test suite, copy the
config-handler executable to `config-handler/tests/fixture`.  To run the test suite, run the command
`pytest` inside the `config-handler` directory.

If testing a new build, be sure to copy it to the fixtures directory before running the tests.
