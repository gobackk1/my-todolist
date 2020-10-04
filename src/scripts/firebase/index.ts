/**
 * Cloud Function と param を渡して、Cloud Function をコールする
 */
export const callCloudFunctions = async (
  cloudFunction: string,
  params: any
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
      .then(response => response.body!.getReader())
      .then(reader => reader!.read())
      .then(({ value }) => {
        const result = new TextDecoder().decode(value)
        resolve(JSON.parse(result))
      })
      .catch(e => resolve(e))
  })
}
