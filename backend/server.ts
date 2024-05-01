import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors()) // Enable CORS

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
let userData: Array<Record<string, string>> = []

app.post('/api/files', upload.single('file'), async (req, res) => {
    // 1. Extract file from request
    const { file } = req
    // 2. Validate that we have file
    if (!file) {
        return res.status(500).json({ message: 'File is required' })
    }
    // 3. Validate the mimetype (csv)
    if (file.mimetype != 'text/csv' && file.mimetype != 'application/vnd.ms-excel') {
        return res.status(500).json({ message: 'File must be CSV' })
    }
    // 4. Transform el File (Buffer) to string
    let json: Array<Record<string, string>> = []
    try {
        const rowCsv = Buffer.from(file.buffer).toString('utf-8')
        console.log(rowCsv)
        // 5. Transform string to JSON
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rowCsv)

    } catch (error) {
        return res.status(500).json({ message: 'Error parsing the file' })
    }
    // 6. Save the JSON to db (or memory)
    userData = json
    // 7. Return 200 with the message and the JSON
    return res.status(200).json({ data: json, message: 'El archivo se cargó correctamente' })
})

app.get('/api/users', async (req, res) => {
    // 1. Extract the query param 'q' from the request
    const { q } = req.query
    // 2. Validate that we have the query param
    if (!q) {
        return res.status(500).json({ message: 'Query param `q` is requiered' })
    }
    if (Array.isArray(q)) {
        return res.status(500).json({ message: 'Query param `q` must be a string' })
    }
    // 3. Filter the data from the db (or memory) with the query param
    const search = q.toString().toLowerCase()
    const filteredData = userData.filter(row => {
        return Object.values(row).some(value => value.toLowerCase().includes(search))
    })
    // 4. Return 200 with the filtered data
    return res.status(200).json({ data: filteredData })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})