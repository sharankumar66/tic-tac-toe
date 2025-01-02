*Looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

## Get started

Install the dependencies...

```bash
cd xoxo-phaserjs
npm install
```

Start the server, located here: https://github.com/heroiclabs/nakama-project-template

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```


Nakama Project Template
===

dows equivalents.

### Go Dependencies

The project uses Go modules which should be vendored as normal:

```shell
env GO111MODULE=on GOPRIVATE="github.com" go mod vendor
```

```

The bundled JavaScript code output can be found in "build/index.js".

### Start

The recommended workflow is to use Docker and the compose file to build and run the game server, database resources and tensorflow-serving (AI model server).

```shell
docker-compose up --build nakama
```

### Recompile / Run

When the containers have been started as shown above you can replace just the game server custom code and recompile it with the `-d` option.

```shell
docker-compose up -d --build nakama
```

### Stop

To stop all running containers you can use the Docker compose sub-command.

```shell
docker-compose down
```

You can wipe the database and workspace with `docker-compose down -v` to remove the disk volumes.

### Run RPC function

A bunch of RPC IDs are registered with the server logic. A couple of these are:

* "find_match" in Go .
* "leaderboard" in Go .

To execute the RPC function with cURL generated a session token:

```shell
curl "127.0.0.1:7350/v2/account/authenticate/device" --data "{\"id\": \""$(uuidgen)"\"}" --user 'defaultkey:'
```

You can also skip the cURL steps and use the [Nakama Console's API Explorer](http://127.0.0.1:7351/apiexplorer) to execute the RPCs.

### Authoritative Multiplayer

The authoritative multiplayer example includes a match handler that defines game logic, and an RPC function players should call to find a match they can join or have the server create one for them if none are available.

Running the match finder RPC function registered as RPC ID "find_match" returns one or more match IDs that fit the user's criteria:

```shell
curl "127.0.0.1:7350/v2/rpc/find_match" -H 'Authorization: Bearer $TOKEN' --data '"{}"'
```

This will return one or more match IDs:

```
{"payload":"{\"match_ids\":[\"match ID 1\","match ID 2\",\"...\"]}"}
```

To join one of these matches check our [matchmaker documentation](https://heroiclabs.com/docs/nakama/concepts/multiplayer/matchmaker/#join-a-match).

### AI/ML model

In addition to starting Nakama and database, `docker-compose.yml` file
also defines the `tf` container, an instance of [TFX](https://www.tensorflow.org/tfx) (formerly known as `Tensorflow Serving`), a service to serve
pre-trained machine learning models.
The model itself is located in the [./model](./model) directory.



Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
