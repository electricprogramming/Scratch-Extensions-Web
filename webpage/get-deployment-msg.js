fetch('/current-deployment-msg')
  .then(res => res.json())
  .then(data => data.message)
  .then(msg => console.log('Current Deployment Message:', msg))