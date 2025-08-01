// Simple test function to check if Netlify functions are working
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message: "Netlify function is working!",
      timestamp: new Date().toISOString(),
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET'
    })
  };
};