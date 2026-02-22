export const urlToId = (url: string | string[]) => {
  const getId = (str: string) => {
    const match = str.match(/\d+$/)
    return parseInt(match ? match[0] : '0')
  }
  return Array.isArray(url) ? url.map((item) => getId(item)) : [getId(url)]
}
