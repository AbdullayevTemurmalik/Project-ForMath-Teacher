interface TeacherProfileProps {
  teacherData: {
    name: string;
    email: string;
    subject: string;
  };
}

export default function TeacherProfile({ teacherData }: TeacherProfileProps) {
    return (
        <div>
            <h2>Teacher Profile</h2>
            <p>Name: {teacherData.name}</p>
            <p>Email: {teacherData.email}</p>
            <p>Subject: {teacherData.subject}</p>
        </div>
    )
}