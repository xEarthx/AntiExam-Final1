import Classroom from '../user/classroom'
import Create from '../user/createclass'
import ClassroomDetail from '../user/classroomdetail';
import ManageQuestion from '../user/managequestion';
import DoExam from '../user/doexam';
import ExamResult from '../user/examresult';
import TeacherResults from '../user/techerresults';
import EditProfile from '../user/editprofile';

const userRoutes = [
    {
        path:"/classroom",
        element: <Classroom/>
    },
    {
        path:"/createclass",
        element: <Create/>
    },
    {
       path: "/classroom/:id",
       element: <ClassroomDetail /> 
    },
    {
        path: "/exam/:exam_id/questions",
        element: <ManageQuestion />
    },
    {
        path: "/exam/:exam_id/do",
        element: <DoExam />
    },
    {
        path: "/exam/:exam_id/result",
        element: <ExamResult />
    },
    {
        path: "/exam/:exam_id/all-results",
        element: <TeacherResults/>
    },
    {
        path: "/edit-profile",
        element: <EditProfile />
    }
]

export default userRoutes