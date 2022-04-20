import axios from 'axios'
export async function post(url: string, data: any) {
  const response = await axios.post(url, { data })
  return response
}
