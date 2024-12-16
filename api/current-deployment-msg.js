export default function handler(req, res) {
  const VERCEL_API_KEY = process.env.VERCEL_API_KEY;
  const PROJECT_NAME = "scratch-extensions-web";
  const TEAM_ID = "team_UdiGAc5Yh2R4JswpV4P7hlsa";
  const reqTimestamp = req.query.timestamp || (Date.now() - 200);
  fetch(
    `https://api.vercel.com/v6/now/deployments?teamId=${TEAM_ID}&projectId=${PROJECT_NAME}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERCEL_API_KEY}`,
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .then(data => data.deployments)
    .then(deployments => {
      let flag;
      deployments.forEach((deployment) => {
        if (deployment.state === "READY" && deployment.target === "production" && deployment.ready < reqTimestamp - 2500) {
          res.status(200).json({ message: deployment.meta.githubCommitMessage });
          flag = true;
          return;
        }
      });
      if (!flag) res.status(404).json({ error: "not found" });
    })
    .catch((error) => res.status(500).json({ error }));
}