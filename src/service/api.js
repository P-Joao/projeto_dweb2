import axios from 'axios'

async function baseApi() {
    const axios = axios.create({
        baseurl: process.env.TMDB_BASE_URL,
        Headers: {
             'Content-Type': 'application/json',
        },
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'pt-BR',
          }
    })

    return axios
}

async function imageApi() {
    const axios = axios.create({
        baseurl: process.env.TMDB_IMAGE_BASE_URL,
        Headers: {
             'Content-Type': 'application/json',
        },
                params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'pt-BR',
          }
    })

    return axios
}

export { baseApi, imageApi }
