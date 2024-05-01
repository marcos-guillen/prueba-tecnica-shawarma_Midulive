
import { type Data, type ApiSearchResponse} from '../types'
import { API_HOST } from '../config'

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
    const Url = API_HOST.trim()
    try {
        const res = await fetch(`${Url}/api/users?q=${search}`)
        if (!res.ok) return [new Error(`Error searching data: ${res.statusText}`)]
        const json = await res.json() as ApiSearchResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error]
    }
    return [new Error('Unknown error')]
}