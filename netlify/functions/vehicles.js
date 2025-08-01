const { Pool } = require('pg');

exports.handler = async (event, context) => {
  try {
    console.log('=== NETLIFY FUNCTION DEBUG ===');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('NETLIFY_DATABASE_URL exists:', !!process.env.NETLIFY_DATABASE_URL);
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET');
    console.log('Event context:', context.functionName);

    // Try both environment variables
    const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    
    if (!dbUrl) {
      console.error('No database URL found in environment!');
      // Return debug info instead of error
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify([
          { 
            id: 1, 
            make: "DEBUG", 
            model: "NO_DATABASE_URL", 
            year: 2024, 
            price: 0, 
            mileage: "Environment variables not set",
            status: "error",
            debug: {
              hasDbUrl: !!process.env.DATABASE_URL,
              hasNetlifyDbUrl: !!process.env.NETLIFY_DATABASE_URL,
              context: context.functionName
            }
          }
        ])
      };
    }

    // Connect to your Replit PostgreSQL database
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('Using database URL:', dbUrl.substring(0, 50) + '...');

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