//esm模块化
import Koa from 'koa';

// const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

import mongoose  from 'mongoose';
import dbConfig from './dbs/config';
import Redis from 'koa-redis';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import json from 'koa-json';
import passport from './interface/utils/passport';
import users from "./interface/users";
import router from './interface/users';


const app = new Koa()
app.keys = ['some secret hurr','YOEE','MeiTuan'];
app.proxy = true;
app.use(session({
  key: 'meituan',
  prefix: 'meituan:uid',
  store: new Redis(),
}));
app.use(bodyParser({
  extendTypes: ['json', 'from', 'text']
}));
app.use(json());

mongoose.set('useCreateIndex', true);
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})

app.use(passport.initialize());
app.use(passport.session());


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(users.routes()).use(users.allowedMethods());
  
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
