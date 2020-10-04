/**
 * Cloud Function と param を渡して、Cloud Function をコールする
 */
export const callCloudFunctions = async (
  cloudFunction: string,
  params: {
    [i: string]: any
  }
): Promise<{
  result: any
}> => {
  const meta = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify(params)
    })
  }

  return new Promise((resolve, reject) => {
    fetch(
      //TODO: APP_URL
      `https://asia-northeast1-todolist-b51fb.cloudfunctions.net/${cloudFunction}`,
      meta
    )
      .then(response => {
        if (response.ok && response.body) return response.body.getReader()
      })
      .then(reader => {
        if (reader) {
          return reader.read()
        } else {
          throw new Error('response error')
        }
      })
      .then(({ value }) => {
        const result = new TextDecoder().decode(value)
        resolve(JSON.parse(result))
      })
      .catch(e => reject(e))
  })
}
