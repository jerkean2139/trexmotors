// Simple test function to verify Netlify functions are working
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message: "Netlify functions are working!",
      timestamp: new Date().toISOString(),
      hasDbUrl: !!process.env.DATABASE_URL,
      hasNetlifyDbUrl: !!process.env.NETLIFY_DATABASE_URL,
      dbPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
      context: context.functionName
    })
  };
};