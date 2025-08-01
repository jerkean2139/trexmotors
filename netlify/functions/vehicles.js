const { Pool } = require('pg');

exports.handler = async (event, context) => {
  try {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET');

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not set!');
      // Fallback to ensure function doesn't fail completely
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify([
          { id: 1, make: "DATABASE", model: "NOT_CONNECTED", year: 2024, price: 0, mileage: "0", status: "error" }
        ])
      };
    }

    // Connect to your Replit PostgreSQL database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Attempting database connection...');
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

    console.log('Database query successful. Rows returned:', result.rows.length);
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
    console.error('Error details:', error.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch vehicles', 
        details: error.message,
        hasDbUrl: !!process.env.DATABASE_URL
      })
    };
  }
};