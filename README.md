Poker Face
==========
**A handy test server builder based on PretendJs**


Introduction
------------

Poker Face is a rather thin wrapper around PretendJs. It gives you
a lean api to map routes to route handlers inside a PretendJs
instance. It also let you stub route handlers thanks to an _ExpressJs_-inspired API without the need for you to write the actual function body for the handler.

Poker Face is particularly useful when mocking API endpoints inside
your tests because it takes care of the usual boileplate making you
able to define the mocks almost on the fly.

Quick-start
-----------
Here we'll give you a quick introduction. You're welcome to peek
inside the spec files to see poker-face in action.

First things first, install Poker Face with your package manager
of choice. E.g.:

```sh
npm install poker-face
# or
yarn add poker-face
```

Now you can import pokerface into your code and fire it up:

```ts
import poker from 'poker-face'

const bluff = poker()
```

Let's try adding a GET endpoint with a JSON response:

```ts
bluff.get("/foo", () => {
  // maybe do something, then...
  // (I quite never know how to format these beasts... u_u)
  return [ 200, {
    "Content-Type": "application/json"
  }, JSON.stringify({
    foo: "bar"
  })]
})
```

Well, nice, but we aren't doing anything that can't be done with
PretendJs already. So, suppose you want to stub that endpoint inside
some test by forcing it to give a fixed answer. The you can
rewrite the above this way:

```ts
bluff.get("/foo")
  .json({
    foo: "bar"
  })
```

Now this is something: we programmed the same behavior in much
less code, in a much more readable, expressive, way.

As soon as the handlers are defined, PretendJs will take care of
mocking any matching network calls behind the scenes. The response
can be built with a fluent syntax and sensible defaults are chosen
according to your intention.

For instance, you might have recognized the `json` method of the _ExpressJs_'s `Response` object. It automatically takes care of serializing your response body into a json string and oh, by the way, it's only normal that a contentful response gets a 200 status code.


Quick-start, continued
----------------------

Say we wanted to send back a JSON payload, but for an error
response, easy enough:

```ts
bluff.get("/danger")
  .status(500)
  .json({
    message: "KA-BOOM!!!"
  })
```

Make it an HTML error response? Sure:

```ts
bluff.get("/done?by=yesterday")
  .status(400)
  .send("<strong>No way</strong>")
```

`send` assumes the response is html by default. If we wanted a 
plain text response we should set it explicitly:

```ts
bluff.get("/coffee")
  .status(418)
  .set("Content-Type", "text/plain")
  .send("I'm a teapot")
```

With this syntax multiple handlers can still be defined in chain:

```ts
bluff
  .post("/foo")
    .set("Location", "/foo/1")
    .sendStatus(201)
  .get("/foo/1")
    .json({
      description: "The one and only"
    })
```

Just keep in mind that, as soon as you specify a body (with `send`,
`json`, etc) your handler is registered. Always configure the rest
of the response before the body.


Future plans
------------

The project is in its infancy, principles and considerations about
further development are:

- Always strive to follow or outright mimick some existing staple
  API. Stick to PretendJs for the server configuration, go along
  the lines of ExpressJS for route definitions. Use the same defaults they would use; only invent when there's no _prior art_.
- Try to include the whole PretendJs API in the base builder or
  at least give an escape hatch to hack through to the wrapped
  PretendJs instance.
- Make the builder stateful, i.e.: a route definition is always
  and only opened by a shorthand route mapping method; it's closed
  by a body-defining method. No other configuration can be done
  inside a route definition.
- Maybe pass an _ExpressJs_-compatible response object to the
  handler functions.