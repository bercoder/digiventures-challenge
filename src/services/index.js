export function Post(url = apiName, body) {
  return new Promise((resolve, reject) => {
    fetch(`/${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => setTimeout(() => resolve(response), 700))
    .catch((err) => reject(err));
  })
}