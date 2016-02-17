Vinli CLI
=========
[![NPM](https://nodei.co/npm/vinli-cli.png?downloadRank=true)](https://nodei.co/npm/vinli-cli/)
<!--
Badge to be added in when there is some stats history:
 [![NPM](https://nodei.co/npm-dl/vinli-cli.png?months=3&height=3)](https://nodei.co/npm/vinli-cli/)
-->

<!-- toc -->
- [Getting Started](#getting-started)
- [Common Features](#common-features)
- [App](#app)
  - [`create`](#app-create)
  - [`list`](#app-list)
  - [`set-current`](#app-set-current)
- [Auth](#auth)
  - [`add-device`](#auth-add-device)
  - [`authorize`](#auth-authorize)
- [Dev](#dev)
  - [`signup`](#dev-signup)
- [Device](#device)
  - [`events`](#device-events)
  - [`latest-vehicle`](#device-latest-vehicle)
  - [`list`](#device-list)
  - [`set-current`](#device-set-current)
  - [`locations`](#device-locations)
  - [`snapshots`](#device-snapshots)
  - [`stream`](#device-stream)
  - [`messages`](#device-messages)
  - [`vehicles`](#device-vehicles)
- [Dummy](#dummy)
  - [`create`](#dummy-create)
  - [`delete`](#dummy-delete)
  - [`list`](#dummy-list)
  - [`routes`](#dummy-routes)
  - [`set-current`](#dummy-set-current)
  - [`start`](#dummy-start)
  - [`status`](#dummy-status)
  - [`stop`](#dummy-stop)
  - [`status`](#dummy-status)
- [`vinlirc`](#vinlirc)
- [Example](#example)

<!-- tocstop -->

## Getting Started

### Prerequisites

To install and use vinli-cli, you will need Node.js (version 4 or greater) and npm  ([nodejs.org](https://nodejs.org/en/download/package-manager)).

### Install

```bash
> npm install -g vinli-cli
```

This will create a global command `vinli` which you can run from anywhere.  To update in the future, just run the same command again.

### Common Features

- **App** - Almost all commands (except `vinlirc`, `signup`) act on behalf of a single app and thus require app credentials and the selection of a single application.  The current working application can be specified in parameters, environment variables of by `app set-current` command.
- **Device** - Device commands show data about devices that have authorized an application to access their data.  These can be actual Vinli devices or Dummies.  The device can be specified via `--device` parameter `VINLI_DEVICE` environment variable or saved to the nearest `.vinlirc` file with the `device set-current` command.
- **Dummy** - Dummies are virtual devices can be created on demand and sent on virtual trips on predefined routes.  A dummy can be added to a My Vinli account that has authorized your app and when it starts a trip the data will come into your application in real time exactly the same as a real Vinli device. Commands that act on a dummy can have a dummy specified by name or id with the `--dummy` parameter, `VINL_DUMMY` environment variable or saved to nearest `.vinlirc` file with `dummy set-current`.  Dummies are associated with an app and there is a limit of 5 per app.  They can be reused multiple times and deleted.
- **since** & **until** - Commands that output sets of dated sets of data can be limited with `--since` and `--until` parameters (or `VINLI_SINCE` / `VINLI_UNTIL` environment variables).  Use either or both parameters to limit the output of the command.  You can enter anything that will parse to a javascript date like `2016-02-14`, `2016-02-14T06:00:00.000Z`, '1455429600000' (milliseconds Epoch), or relative values like `1 hour ago` (seconds/minutes/hours/days/weeks/months/years)
- **Output** - Output of almost all commands can be formatted to support easier integration with the parameter `--output [format]` or `-o [format]`.  Supported formats are `table` (default), `json`, `yaml`, or `text`
- **Help** - `-h` or `--help` with any command or subcommand will output help contents and accepted parameters.  Ex: `vinli --help`, `vinli app -h`, `vinli dummy set-current --help`.

## App
### `app create`
`vinli app create` - Create a new app, will prompted for the following:

- email - Developer portal email address
- password - password for this account (not saved)
- name - name for your new app
- status - dev or prod (default is dev)
- type - Category for your app (optional, default is none). Valid values: `consumer`, `admin`, `enterprise`

This is a short cut for creating an account at https://dev.vin.li/#/sign-up

### `app list`
List current apps for your dev-portal account.  Will prompt you for your login and password.

* `vinli app list` - list current apps, after being prompted for login and password
* `vinli app list --email [email address] --password [password] -o json` - output list of apps to json


### `app set-current`
This selection will be saved in the closest `.vinlirc` file.  Vinli-cli will prompt for your dev-portal email and password to lookup the app (either by name or by id) and will retrieve the corresponding secret.  If you are not currently signed in to a developer account, you can specify the appId and appSecret to use:
* `vinli app set-current --app "My App"` - will use your dev-portal token to find an app with the nearest name
* `vinli app set-current --app 6cbced16-d831-469c-898d-8b83f0f8fd5f` - will use your dev-portal token to find the app with the given ID
* `vinli app set current --app d0810cc9-3e78-4411-a6ff-4ebb4a4c0243 --secret xZmuKWEJrTUM66mxeEjan` - will set the app credentials directly

You can also specify the app individually in every command, which will not modify the current app selection in `.vinlirc`:
* `vinli <service> <command>"` (app and secret loaded from nearest `.vinlirc` file)
* `vinli <service> <command> --app="My App"`
* `vinli <service> <command> --app=6cbced16-d831-469c-898d-8b83f0f8fd5f`
* `vinli <service> <command> --app=d0810cc9-3e78-4411-a6ff-4ebb4a4c0243 --secret=xZmuKWEJrTUM66mxeEjan`

## Auth

### `auth add-device`
`auth add-device [--username str] [--password str] [[--case-id [str]]|[--dummy [nameOrId]]] [--name str]`

Add a device to a user's account.  Use case ID of a real device or a dummy, or specify dummy by name or id.  Cannot specify dummy and case id.  `--name` is optional will be label for the device visible to the user logged into My Vinli.

If not entered as options you will be prompted for your MyVinli username and password (not saved) as well as a caseId.  If a device has been saved to your `.vinlirc` file with the `device set-current` command it will be populated, but you may override it.

### `auth authorize`
Authorize an app for a MyVinli account.  **Your app must have a WEB client created first**.  Clients must be created through the developer portal for now.  For testing purposes the Redirect URI can be any valid URI. Requires `app` and `secret`.

## Dev

### `dev signup`
`vinli dev signup [--firstName str] [--lastName str] [--email str] [--password str]`
Create a developer account.  Will prompt for the following values: `firstName`, `lastName`, `email`, `password`.

You will be sent a confirmation email that needed to activate your account before you can proceed.

## Device
### `device events`
Get device event history.

Requires `--device` param or current device saved in `.vinlirc`. Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device locations`:
* `--limit`
* `--since`
* `--until`

### `device latest-vehicle`
Get the vehicle information for last vehicle a device was seen in.
Requires `--device` param or current device saved in `.vinlirc`. Supports output formatting with `--output`. Requires `app` and `secret`.

### `device list`
Get a list of devices that available to an app.  These can be real devices or dummies.  Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device list`:
* `--limit`
* `--offset`

### `device set-current`
Most commands require the selection of a device.  This is similar to the app selection and will also be stored in the nearest `.vinlirc` file.  Requires `--device` param. Requires `app` and `secret`.

* `vinli device set-current --device 74ce1599-72e3-4353-8637-0cc4e2bffe54`

As with the app selection, device selection can be provided on a per-command basis:

* `vinli <service> <command> --device d000af8f-883a-4ce8-8edb-354097cc8d3f`

### `device locations`
Get a list of location coordinates for a device.

Requires `--device` param or current device saved in `.vinlirc`. Fields in output can be limited with `--fields [list]` parameter. Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device locations`:
* `--limit`
* `--since`
* `--until`

### `device snapshots`
Get a list of telemetry snapshots for a device.

Requires `--device` param or current device saved in `.vinlirc`. Fields in output can be limited with `--fields [list]` parameter. Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device snapshots`:
* `--limit`
* `--since`
* `--until`

### `device stream`
Subscribe to a stream of device messages.

Requires `--device` param or current device saved in `.vinlirc`. Requires `app` and `secret`. Supports output formatting with `--output`, but only `table` and `json` are supported.s

### `device messages`
Get recent messages that a device has sent in to the platform.

Requires `--device` param or current device saved in `.vinlirc`. Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device snapshots`:
* `--limit`
* `--since`
* `--until`

### `device vehicles`
Get a list of vehicles a devices has been in.

Requires `--device` param or current device saved in `.vinlirc`. Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `device snapshots`:
* `--limit`
* `--offset`

## Dummy
### `dummy create`
Add a dummy to the current app.  There is a limit of 5 per account. Only required field is `--name`.  Takes up to a minute to create.

Supports output formatting with `--output`. Requires `app` and `secret`.

### `dummy delete`
Delete a dummy from the current app.  Can specify dummy name or id with `--dummy` parameter.  If a name is given a fuzzy search will be done for current dummies on that account and the best match will be deleted.

### `dummy routes`
Return a list of routes available for dummy trips.  Supports output formatting with `--output`. Requires `app` and `secret`.

Pagination parameters for `dummy routes`:
* `--limit`
* `--offset`

### `dummy set-current`
Specify a dummy name or id to save to the nearest `.vinlirc` file. Requires `app` and `secret`.

### `dummy start`
Send a dummy on a trip with the specified route.  The account that has this dummy added will play the route data in real time to apps that have been authorized.  Accepts parameters:
* `--dummy <id|name>` - if name is given a search will be performed and the best match used
* `--route <id|name>` - if name is given a search will be performed and the best match used
* `--vin <vin number>` - OPTIONAL, a random VIN will be generated, or you can provide a 17 digit VIN (Capital letters and numbers, no I or O letters, must start with VV)
* `--repeat` - if this flag is set the route will be looped indefinitely until you delete it.

Supports output formatting with `--output`. Requires `app` and `secret`.

### `dummy status`
Get the status of a dummy.

Supports output formatting with `--output`. Requires `app` and `secret`.

### `dummy stop`
Specify a dummy name or id to stop all routes for.  Routes in progress take up to 30 seconds to stop after the command succeeds.

Requires `app` and `secret`.

## `vinlirc`
`vinli vinlirc` - Outputs your current derived `.vinlirc` file.

Your vinli-cli settings are stored as json in `.vinlirc` files.  The config is obtained by merging multiple configurations in order of importance:

- CLI arguments via --param-name  `--device d000af8f-883a-4ce8-8edb-354097cc8d3f`
- Environment variables with namespace `VINLI_`  `export VINLI_DEVICE=d000af8f-883a-4ce8-8edb-354097cc8d3f`
- All `.vinlirc` files found while traversing the directory tree starting from the current working directory stopping at your home directory, or if your current directory is not a subdirectory of the working tree your home directory is the lowest priority.
```
HOME = '/Users/vindiesel'
CWD = '/Users/vindiesel/code/vinliapp/'
Nearest (high priority) to farthest (low priority) .vinlirc files, if they exist:
[ '/Users/vindiesel/code/vinliapp/.vinlirc',
  '/Users/vindiesel/code/.vinlirc',
  '/Users/vindiesel/.vinlirc' ]

HOME = '/Users/vindiesel'
CWD = /opt/node/myapp
[ '/opt/node/myapp/.vinlirc',
  '/opt/node/.vinlirc',
  '/opt/.vinlirc',
  '/.vinlirc',
  '/Users/vindiesel/.vinlirc' ]
```

## Example
This is a comprehensive example starting from signing up for a developer account, creating an application, creating a dummy device, authorizing the app for a MyVinli account, adding the dummy device to an account, sending the dummy device on a virtual trip and viewing the telemetry data the app received from the device.

```bash
> vinli dev signup
  [prompted for name, email and password.  Must]

> vlinli app create --name "My App"
  [prompted for email and password]

> vinli app set-current "My App"
  [finds the app closest to the name "My App" (using levenshtein distance) and sets it as current]
Authenticated user
Setting Current: My App
  Saved to /Users/vindiesel/connectedcar/.vinlirc

> vinli app list
┌──────────────────────────────────────┬────────────┬──────────────────┬─────────────────────────────────────────┐
│ ID                                   │ Name       │ Description      │ Created                                 │
├──────────────────────────────────────┼────────────┼──────────────────┼─────────────────────────────────────────┤
│ 24f5a02e-a625-4592-bbd8-185b899af673 │ My App     │ my description   │ Thu Jan 28 2016 15:26:10 GMT-0600 (CST) │
└──────────────────────────────────────┴────────────┴──────────────────┴─────────────────────────────────────────┘

> vinli app list -o json
{
  "apps": [
    {
      "id": "24f5a02e-a625-4592-bbd8-185b899af673",
      "name": "My App",
      "description": "my description",
      "secret": "UwvaIpkTaiOS_p_ykb",
      "icon": null,
      "type": "consumer",
      "status": "dev",
      "isDeleted": false,
      "createdAt": "2016-01-28T21:26:10.127Z",
      "updatedAt": "2016-01-28T21:26:10.127Z"
    }
  ]
}

> vinli app get -o yaml
apps:
  - id: 24f5a02e-a625-4592-bbd8-185b899af673
    name: My App
    description: my description
    secret: UwvaIpkTaiOS_p_ykb
    icon: null
    type: consumer
    status: dev
    isDeleted: false
    createdAt: '2016-01-28T21:26:10.127Z'
    updatedAt: '2016-01-28T21:26:10.127Z'

> vinli auth authorize
[Assuming you have created a WEB client on the developer portal for the current app]
Signing in to vindiesel@vin.li MyVinli account...
Authenticated user.  Initiation OAuth flow for application...
Authorizing application...
Application authorized successfully
OAuth Bearer token ==> 09820939082389009ioweirweoiuweriou2323082
To use Bearer token:
curl -H "Authorization: Bearer 09820939082389009ioweirweoiuweriou2323082" https://platform.vin.li/api/v1/devices

> vinli dummy create --name dummy1
┌───────────┬──────────────────────────────────────┐
│        ID │ e6156529-b6aa-475e-47de-741b320cdff7 │
│      Name │ dummy1                               │
│ Device ID │ de1c64f6-b6aa-475e-b6aa-da60dd4b240e │
│   Case ID │ VV2UF8N                              │
└───────────┴──────────────────────────────────────┘

> vinli dummy list
┌──────────────────────────────────────┬─────────────────┬──────────────────────────────────────┬─────────┐
│ ID                                   │ Name            │ Device ID                            │ Case ID │
├──────────────────────────────────────┼─────────────────┼──────────────────────────────────────┼─────────┤
│ e6156529-b6aa-475e-47de-741b320cdff7 │ dummy1          │ de1c64f6-b6aa-475e-b6aa-da60dd4b240e │ VVT2F3N │
└──────────────────────────────────────┴─────────────────┴──────────────────────────────────────┴─────────┘
                                                                                         Showing 1 - 1 of 1

> vinli auth add-device --dummy dummy1
Authenticated user
	Device Added

> vinli device list
┌──────────────────────────────────────┬───────────────────┬─────────────────────────────────────────┐
│ ID                                   │ Name              │ Created                                 │
├──────────────────────────────────────┼───────────────────┼─────────────────────────────────────────┤
│ de1c64f6-b6aa-475e-b6aa-da60dd4b240e │ dummy1            │ Mon Feb 01 2016 15:31:58 GMT-0600 (CST) │
└──────────────────────────────────────┴───────────────────┴─────────────────────────────────────────┘
                                                                                    Showing 1 - 1 of 1

> vinli device set-current --device e1c64f6-b6aa-475e-b6aa-da60dd4b240e


> vinli dummy routes -o json
{
  "routes": [
    {
      "id": "3c9f5e58-d97a-46cf-beb1-67574d6c9e3f",
      "name": "Long Route - SFO",
      "description": "Out and about near San Francisco International Airport",
      "messageCount": 915,
      "locationCount": 675,
      "distanceByGPS": 22837,
      "distanceByVSS": 33959.9,
      "duration": 4313168,
      "preview": "anqdFvb`jVwAiI]cCAuAq@oERKxA|@Vn@Bt@n@~G_DfA_DtAWVSpAKhAEtF?@BAAhDG~A_@zA_Al@mCt@wKjCgBt@kBl@kBd@wAX{@Da@HMJGGb@BgA\\eAAuC`@oBj@yBJgGrCaBX{ARaAHk@QS}@Gq@GSEEMHOl@O^AJ?CLDCAU`@KHu@Vw@HcATiAJ_AN}A[G?J]C^M@a@GiDiAsCgB}@q@_AaBgA{FSsAg@}@cAKw@\\MhAn@`CRbAl@dCf@jGm@z@m@jBgBxAyFv@uBd@_DhAiFzC}BfA{FbCiC|@oCf@oC`@yIl@iH\\uCFcV|@yK^uBD_EIiDq@kCm@i@sCGmEKqAYq@W]WO[C]f@cB|EKfAJnAd@hAfCfCd@bAFVK`DR\\xClASrA[`DUxACd@I\\H\\l@RxB^jA^xCr@hEjA|Bp@lAVJPA^_@|B?T@FBBTDLADEB@AFG@EAIBIAFU@BE?NEDKDAGT@H@CcTaMu@SRoAVeAL}AHqCXKn@DpB~@fCT`JmCVU@@A@?At@k@jBsAfCqBtCa@hFStBOzBSvDYlNm@|C]lCa@jGcB|CaA|DwAzC}@vCm@|JaAdJw@zCa@bN{@bIcAxCk@jCq@bCw@xB_AhCi@jDiArCk@~G_BtGqAhCk@hNkDfDoAnBe@hB}@fBkC`@kC?{CW}C[}CiBiHq@kDk@aEBoAf@a@dE~OkBU_Ch@y@Xy@PIZOPG?JSVWMKWNc@r@KpABfNIlBaAbBmAh@gD~@kFlAmMxDsA\\aBCe@TCSl@_AYlAyBReCl@kDtAkC`@sBp@aB`@wANw@LEGDAFJGEq@CWy@Ig@Sc@Y|@INMNS?l@]LM?OMOCKCAEPmB`C_Av@`@g@h@e@h@YEAOD?Av@St@[ADIFEBdByAP[B?@FeA~CVShAiBi@R_@JV@FKQGO@_AV}@j@n@]h@Qr@]hAsANI]HiBhBe@`@Q^ERJk@]~AODaACeB\\qAFoAVa@N_ByAuAWs@a@mBmAyAc@}ByD_@gBi@mD[s@o@OCC[BUHm@tAt@|CVrAZpAn@r@Nv@Vh@Jd@Kl@m@t@aBvDiBhAgFv@{B`@{Bt@yBpAcDrBaJxDkCt@qCn@iJ|@{N\\yCLqCP}I^eL\\wBPyBBiB?cBGoHsAo@SYk@JkA@yDIuA[qASSICAEi@Gq@~@e@hAiAnDDxAh@hAzB|Bn@bAPfAEx@OEGl@^h@b@Z|Av@R\\KfAWlAk@bE?v@^b@~CNbA`@bD~@~@\\jAXbD~@bB^MrAUjADVNPIOUDBFPLPRJ@FDDCJS"
    },
    {
      "id": "170820b0-fc2d-4ee6-aacd-88011d542545",
      "name": "Med Route - DFW",
      "description": "Out and about in Dallas",
      "messageCount": 277,
      "locationCount": 260,
      "distanceByGPS": 9357.61,
      "distanceByVSS": 9596.56,
      "duration": 957793,
      "preview": "wyhgEdeimQxDnCpBfEUpATnB~CdFbAl@l@bBVpBXhBz@~At@jArBbC`AtA|@vAfKxSjCxDhLzKh@Vn@JhDfAnBx@dA\\~FfEtGjO~@xAdFzC`ApBzAtA|AnAfAdA~@hBn@dBv@vAjAj@bB^z@d@Pz@JPnB~Ap@Z^pBb@|@Vb@r@d@\\l@bA|At@f@fIlIz@`ArClDn@|@jEdEp@d@j@n@Fh@?~@BvAF|ABzEDdBZpF\\xILfFLzC?rBDxBNxBfAvFXzB`@lBVl@Nn@`@xAnAjCH^VRp@bA\\Td@z@^hAXNb@b@Vd@^Tv@tAxBvBn@b@Ph@PZlAjBb@\\`@Tj@ThB`B|AjAr@VxA|@lBvA`ElDp@|@QvBa@`Au@|@y@LQJSnAM\\YZc@Xc@d@o@\\_AnBCj@FdApAfAd@vAn@lHFfBV|AJzAEhAJe@E?BMHF`@nAXtAFhARdBb@zBnAfNH|ABlBTfBfAjBEjE?jBPjB`@|Ag@n@~@d@x@x@z@lAd@|@v@lBXfAqCxAiBvAIIVM@SAHJOBZEG@CBBW^{@j@_A[GQA@EAG@EI\\RXHEUEV?XFQHER@ROD?BJKF[H@BDAKA"
    },
    {
      "id": "5399a0f9-acd9-4b0d-9052-24bd756281de",
      "name": "test route",
      "description": "it's a trap",
      "messageCount": 9,
      "locationCount": 9,
      "distanceByGPS": 456.446,
      "distanceByVSS": 422.96,
      "duration": 321988,
      "preview": "ya`nEhyxaO|BqB~@m@v@w@rA`@fAz@bEpCrAtA"
    },
    {
      "id": "88d07d0f-0a62-4ebf-a624-423dc83bd9a0",
      "name": "Vegas Short Route",
      "description": "First Vegas Route",
      "messageCount": 97,
      "locationCount": 97,
      "distanceByGPS": 8929.64,
      "distanceByVSS": 1625.48,
      "duration": 321988,
      "preview": "ufs{Ezok}TcHxSuLNoAEmAKoB[eC{@_IaGmBqAeAk@_Aa@mD{@aBOaCE_m@|@`@pmBc@Kyj@Hi@~EIjLLaSrNLj\\Ab@SlFA\\EtEl@fA`@fAj@vAfA`DpDfA~@xA|@fBj@rAVhFdF?vSMp@@p|@CzE\\q@x@gAzBoCjT_W"
    }
  ],
  "meta": {
    "pagination": {
      "total": 6,
      "limit": 100,
      "offset": 0
    }
  }
}

> vinli dummy start --dummy dummy1 --route Vegas
Starting run of Vegas Short Route for dummy dummy1 (VV40HP640BYZ90GD2)...
Run started

> vinli dummy status
┌────────────────┬──────────────────────────────────────┐
│             ID │ 63b2f09b-4b69-4a66-a001-11ff4e4ce91e │
│          Route │ Vegas Short Route                    │
│         Status │ running                              │
│         Repeat │ false                                │
│   Repeat Count │                                      │
│    Speed (kph) │ 31                                   │
│  Remaining (s) │ 255.729                              │
│ Remaining Msgs │ 82                                   │
└────────────────┴──────────────────────────────────────┘

> vinli dummy stop
Stopping run for dummy dummy1...
Run stopping...

> vinli device locations
┌───────────────────────────┬──────────────────────────────────────┬─────────────────────┬───────────────────┐
│ Timestamp                 │ ID                                   │ Longitude           │ Latitude          │
├───────────────────────────┼──────────────────────────────────────┼─────────────────────┼───────────────────┤
│ 2016-02-01 18:23:39 -0600 │ db0ea7ce-4e03-4507-884c-5c01395fe3f3 │ -115.09814000000001 │ 36.1663           │
│ 2016-02-01 18:23:39 -0600 │ 40f7cfa7-572b-4d5b-b9eb-171781f003d0 │ -115.0982           │ 36.16612000000001 │
│ 2016-02-01 18:23:39 -0600 │ c5b40764-feab-44be-85c8-e5c67386602e │ -115.09722833389951 │ 36.16612835295922 │
│ 2016-02-01 18:23:39 -0600 │ 414657f7-10ba-4c36-9f70-affdec18e5d0 │ -115.09625666753283 │ 36.16613669806842 │
│ 2016-02-01 18:23:39 -0600 │ 31e6f2b9-b285-456b-84a6-54ed78b27680 │ -115.09431333417925 │ 36.16615336473527 │
│ 2016-02-01 18:23:39 -0600 │ 182d8a7f-013a-4847-bd23-0eafff78da1f │ -115.09334166719275 │ 36.1661616862929  │
│ 2016-02-01 18:23:39 -0600 │ 0a64116b-c829-44a6-b1af-8a25bf5b84e5 │ -115.09237          │ 36.16617          │
│ 2016-02-01 18:23:39 -0600 │ a2fbcd7b-97c9-43fe-9eb7-af7932b71c5a │ -115.09133000053536 │ 36.16618667565872 │
│ 2016-02-01 18:23:39 -0600 │ 3d0c8f1c-8159-4726-9343-26e131c100de │ -115.09029000048878 │ 36.16620334232614 │
│ 2016-02-01 18:23:39 -0600 │ 29f26268-74a1-43f4-a940-d456ada829bd │ -115.08742333342329 │ 36.16622667360286 │
└───────────────────────────┴──────────────────────────────────────┴─────────────────────┴───────────────────┘
                                                                                     Showing 10, 308 remaining

> vinli device snapshots --fields rpm
┌───────────────────────────┬──────────────────────────────────────┬───────┐
│ Timestamp                 │ ID                                   │   RPM │
├───────────────────────────┼──────────────────────────────────────┼───────┤
│ 2016-02-01 18:23:22 -0600 │ db0ea7ce-4e03-4507-884c-5c01395fe3f3 │   797 │
│ 2016-02-01 18:23:19 -0600 │ 40f7cfa7-572b-4d5b-b9eb-171781f003d0 │   812 │
│ 2016-02-01 18:23:16 -0600 │ c5b40764-feab-44be-85c8-e5c67386602e │   810 │
│ 2016-02-01 18:23:12 -0600 │ 414657f7-10ba-4c36-9f70-affdec18e5d0 │   804 │
│ 2016-02-01 18:23:09 -0600 │ 31e6f2b9-b285-456b-84a6-54ed78b27680 │ 810.5 │
│ 2016-02-01 18:23:06 -0600 │ 182d8a7f-013a-4847-bd23-0eafff78da1f │   804 │
│ 2016-02-01 18:23:03 -0600 │ 0a64116b-c829-44a6-b1af-8a25bf5b84e5 │ 807.5 │
│ 2016-02-01 18:23:00 -0600 │ a2fbcd7b-97c9-43fe-9eb7-af7932b71c5a │   798 │
│ 2016-02-01 18:22:57 -0600 │ 3d0c8f1c-8159-4726-9343-26e131c100de │   797 │
│ 2016-02-01 18:22:54 -0600 │ 29f26268-74a1-43f4-a940-d456ada829bd │   813 │
└───────────────────────────┴──────────────────────────────────────┴───────┘
                                                   Showing 10, 288 remaining

```
