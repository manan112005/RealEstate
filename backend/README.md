# HomeSpace Backend

This is the Node.js Express backend for the HomeSpace real estate portal.

## Tech Stack
- **Node.js** + **Express**
- **PostgreSQL** + **Sequelize** (ORM)
- **Cloudinary** (Image hosting)
- **JWT** (Authentication)

## Local Development

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (v13+)
- Cloudinary Account (for image uploads)

### 2. Environment Variables
Create a `.env` file in the root of the `/backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=homespace
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database
Create an empty PostgreSQL database named `homespace`.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Migrations (Sync Database)
This command will create all the necessary tables in your PostgreSQL database based on the Sequelize models:
```bash
node src/models/sync.js
```

### 6. Start the Server
Run the application in development mode (with hot-reloading via Nodemon):
```bash
npm run dev
```
The API will be available at `http://localhost:5000/api`.

## Production Deployment (Render / Railway)
This backend is fully prepared for PaaS deployment. 
1. Connect your GitHub repository to Render/Railway.
2. Set the Root Directory to `/backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. **Important**: You must populate all the Environment Variables listed in the `.env` section directly within your Render/Railway dashboard.
