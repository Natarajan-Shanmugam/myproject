import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

const fileName = process.argv[2];

if (!fileName) {
    console.error('❌ SQL file is required.');
    console.error('Example: npm run db:sync -- 001_add_is_active.sql');
    process.exit(1);
}

const sqlPath = path.join(__dirname, '', fileName);
const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');

if (!fs.existsSync(sqlPath)) {
    console.error(`❌ SQL file not found: ${sqlPath}`);
    process.exit(1);
}

if (!fs.existsSync(dbPath)) {
    console.error(`❌ SQLite database not found: ${dbPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log,
});

async function run() {
    try {
        await sequelize.authenticate();

        console.log(`📄 SQL file: ${fileName}`);
        console.log(`🗄️ Database: ${dbPath}`);

        await sequelize.query(sql);

        console.log('✅ Database updated successfully.');
    } catch (error) {
        console.error('❌ Database update failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

run();