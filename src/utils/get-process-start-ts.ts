export const getProcessStartTs = (): Date => {
  const uptimeInMilliseconds = Math.round(process.uptime() * 1000);
  return new Date(Date.now() - uptimeInMilliseconds);
};
