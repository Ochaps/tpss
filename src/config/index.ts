import dotenv from 'dotenv'
dotenv.config()

export const isProduction: boolean = process.env.NODE_ENV !== 'development'
export const PORT: number = parseInt(process.env.PORT ?? '3000')
