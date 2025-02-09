export const convertToCSV = (data) => {
  if (!data) return '';

  // Prepare data for CSV format
  const feedbackData = data.recentFeedback.map(feedback => ({
    course: feedback.course_name,
    user: feedback.user_name,
    role: feedback.role,
    rating: feedback.rating,
    comments: feedback.comments?.replace(/,/g, ';'), // Replace commas in comments
    submitted_at: new Date(feedback.submitted_at).toLocaleString()
  }));

  // Get headers from the first object
  const headers = Object.keys(feedbackData[0] || {});
  
  // Create CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...feedbackData.map(row => 
      headers.map(header => 
        row[header] === null || row[header] === undefined ? '' : row[header]
      ).join(',')
    )
  ];

  return csvRows.join('\n');
}; 