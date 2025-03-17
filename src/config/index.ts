import dotenv from 'dotenv'

dotenv.config()

const { VIDEO_BASE_PATH, DATA_ROOT_PATH} = process.env


// export const DATA_ROOT_PATH = process.env.DATA_ROOT_PATH

export {
  VIDEO_BASE_PATH, DATA_ROOT_PATH
}