export function responseFormat(msg: string, statusCode: number, data: any)
{
  let RESPONSE: { msg: string, statusCode: number, data: any } = { msg, statusCode, data }
  throw new Error(JSON.stringify(RESPONSE));
}


export function errorProps(error: any)
{
  const errMsg = error.msg 
  const code = error.statusCode
  const data = error.data
  return { errMsg, code, data }
}