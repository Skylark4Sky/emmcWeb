let serverConfig = null
switch (process.env.NODE_ENV) {
  case 'development':
    serverConfig = {
      rootPath: 'http://iot.gisunlink.com/api/'
    }
    break
  case 'testing':
    serverConfig = {
      rootPath: 'http://iot.gisunlink.com/api/'
    }
    break
  case 'cloud':
    serverConfig = {
      rootPath: 'http://iot.gisunlink.com/api/'
    }
    break
  default:
    serverConfig = {
      rootPath: 'http://iot.gisunlink.com/api/'
    }
    break
}

export default Object.assign(serverConfig)
