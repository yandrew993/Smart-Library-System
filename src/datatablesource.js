export const userColumns = [
  { field: "teacherId", headerName: "Load Number", width: 200, headerAlign: "center", align: "center" },
  {
    field: "teacherName",
    headerName: "Teacher Name",
    width: 200,
    headerAlign: "center", align: "center",
    renderCell: (params) => (
      <div className="cellWithImg">
        {params.row.teacherName}
      </div>
    ),
  },
];

export const postColumns = [
  { field: "id", headerName: "ID", width: 70, headerAlign: "center", align: "center" },
  //{ field: "bookId", headerName: "Book ID", width: 200, headerAlign: "center", align: "center" },
  { field: "code", headerName: "Subject Code", width: 200, headerAlign: "center", align: "center" },
  { field: "subjectName", headerName: "Subject", width: 200, headerAlign: "center", align: "center" },
];

export const postDetailColumns = [
  { field: "formLevel", headerName: "Class Level", width: 70 },
  { field: "ClassName", headerName: "Class Name", width: 200 },
  { field: "stream", headerName: "Stream", width: 150 }
];

export const savedPostColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "postId", headerName: "Post ID", width: 200 },
  { field: "userId", headerName: "User ID", width: 200 },
  { field: "createdAt", headerName: "Saved At", width: 200 },
];

export const chatColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "users", headerName: "Users", width: 300, valueGetter: (params) => params.row.users.join(", ") },
  { field: "lastMessage", headerName: "Last Message", width: 300 },
  { field: "createdAt", headerName: "Created At", width: 200 },
];

export const messageColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "text", headerName: "Message", width: 300 },
  { field: "userId", headerName: "User ID", width: 200 },
  { field: "chatId", headerName: "Chat ID", width: 200 },
  { field: "createdAt", headerName: "Sent At", width: 200 },
];

export const bookingColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "userId", headerName: "User ID", width: 200 },
  { field: "postId", headerName: "Post ID", width: 200 },
  { field: "startDate", headerName: "Start Date", width: 180 },
  { field: "endDate", headerName: "End Date", width: 180 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "createdAt", headerName: "Booked At", width: 200 },
];

export const paymentColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "amount", headerName: "Amount ($)", width: 120 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "method", headerName: "Payment Method", width: 200 },
  { field: "transactionId", headerName: "Transaction ID", width: 300 },
  { field: "bookingId", headerName: "Booking ID", width: 200 },
  { field: "createdAt", headerName: "Paid At", width: 200 },
];
