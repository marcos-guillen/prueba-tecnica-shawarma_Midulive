
import { type Data, type ApiUploadResponse} from '../types'
import { API_HOST } from '../config'

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
    const Url = API_HOST.trim()
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await fetch(`${Url}/api/files`, {
            method: 'POST',
            body: formData
        })
        if (!res.ok) return [new Error(`Error uploading file: ${res.statusText}`)]
        const json = await res.json() as ApiUploadResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error]
    }
    return [new Error('Unknown error')]
}