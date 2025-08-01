const { Pool } = require('pg');

exports.handler = async (event, context) => {
  try {
    // Connect to your Replit PostgreSQL database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const result = await pool.query(`
      SELECT 
        id,
        make,
        model,
        year,
        price,
        mileage,
        status,
        exterior_color as "exteriorColor",
        interior_color as "interiorColor",
        description,
        stock_number as "stockNumber",
        vin,
        images,
        CASE 
          WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN images[1]
          ELSE 'https://via.placeholder.com/600x400/0066cc/ffffff?text=' || replace(make, ' ', '+') || '+' || replace(model, ' ', '+')
        END as "imageUrl"
      FROM vehicles 
      WHERE status = 'for-sale' 
      ORDER BY id DESC
    `);

    await pool.end();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      },
      body: JSON.stringify(result.rows)
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: 'Failed to fetch vehicles' })
    };
  }
};